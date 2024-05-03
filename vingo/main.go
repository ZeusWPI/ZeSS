package main

import (
	"crypto/rand"
	"log"
	"math/big"
	"os"

	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/template/html/v2"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	ZauthClientId, id_ok := os.LookupEnv("ZauthClientId")
	if !id_ok {
		log.Fatal("ZauthClientId not set")
	}

	ZauthClientSecret, secret_ok := os.LookupEnv("ZauthClientSecret")
	if !secret_ok {
		log.Fatal("ZauthClientSecret not set")
	}

	db := CreateDb()
	defer db.Close()
	engine := html.New("./layouts", ".html")
	store := session.New()

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Session error")
		}
		id := sess.Get("id")
		username := sess.Get("username")
		return c.Render("index", fiber.Map{"id": id, "username": username})
	})

	app.Get("/login", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Session error")
		}

		state, _ := rand.Int(rand.Reader, big.NewInt(1000000000))
		sess.Set("state", state.String())
		sess.Save()

		return c.Status(200).Redirect("https://adams.ugent.be/oauth/authorize?client_id=" + ZauthClientId + "&response_type=code&state=" + state.String() + "&redirect_uri=http://localhost:4000/auth/callback")
	})

	type Scan struct {
		ScanTime string
		Serial   string
	}

	app.Get("/user/scans", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Session error")
		}
		zauth_id := sess.Get("id")

		scans_select, _ := db.Prepare("select scans.scan_time, scans.serial from cards left join scans where user == ?;")
		log.Println(zauth_id)
		scan_rows, err := scans_select.Query(zauth_id)
		if err != nil {
			log.Println(err)
			return c.Status(400).SendString("Error fetching scans")
		}

		var scans []Scan

		for scan_rows.Next() {
			var scan Scan
			_ = scan_rows.Scan(&scan.ScanTime, &scan.Serial)

			scans = append(scans, scan)
		}

		return c.Render("scans", fiber.Map{"scans": scans})
	})

	// can only be done while an active register session was initiated by the user, and only from kelder
	app.Post("/card/register", func(c *fiber.Ctx) error {
		data := c.Body()
		card_id := string(data)

		card_insert, _ := db.Prepare("INSERT INTO cards (serial, user) VALUES (?, 1234);")
		_, err := card_insert.Exec(card_id)
		if err != nil {
			log.Println(err)
			return c.Status(400).SendString("Card already registered")
		}

		return c.SendString("Card registered")
	})

	// scan can be unauthenticated, but only from kelder?
	app.Post("/card/scan", func(c *fiber.Ctx) error {
		data := c.Body()
		card_id := string(data)

		scan_insert, _ := db.Prepare("INSERT INTO scans (scan_time, serial) VALUES (datetime('now'), ?);")
		res, err := scan_insert.Exec(card_id)
		if err != nil {
			log.Println(err)
			// technically only when error is foreign key constraint
			return c.Status(404).SendString("Card doesn't exist")
		}

		log.Println(res)
		log.Println(card_id)
		return c.SendString("Card scanned")
	})

	// oauth
	app.Get("/auth/callback", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Session error")
		}

		// Check if saved state matches the one returned by Zauth
		expected_state := sess.Get("state")
		actual_state := c.Query("state")
		if expected_state != actual_state {
			log.Println("State mismatch")
			return c.Status(400).SendString("State mismatch")
		}

		// Convert code into access token
		code := c.Query("code")

		args := fiber.AcquireArgs()
		defer fiber.ReleaseArgs(args)
		args.Set("grant_type", "authorization_code")
		args.Set("code", code)
		args.Set("redirect_uri", "http://localhost:4000/auth/callback")

		type Token struct {
			AccessToken string `json:"access_token"`
			TokenType   string `json:"token_type"`
			ExpiresIn   int    `json:"expires_in"`
		}

		zauth_token := new(Token)
		status, _, errs := fiber.Post("https://adams.ugent.be/oauth/token").BasicAuth(ZauthClientId, ZauthClientSecret).Form(args).Struct(zauth_token)
		if len(errs) > 0 || status != 200 {
			log.Println(status)
			log.Println(errs)
			return c.Status(500).SendString("Error fetching token")
		}

		// User access token to get user info
		type User struct {
			Id       int    `json:"id"`
			Username string `json:"username"`
		}

		zauth_user := new(User)
		status, _, errs = fiber.Get("https://adams.ugent.be/current_user").Set("Authorization", "Bearer "+zauth_token.AccessToken).Struct(zauth_user)
		if len(errs) > 0 || status != 200 {
			log.Println(status)
			log.Println(errs)
			return c.Status(500).SendString("Error fetching user")
		}

		// Insert user into database using the Zauth id
		_, err = db.Exec("INSERT OR IGNORE INTO users (zauth_id) VALUES (?);", zauth_user.Id)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Error inserting user")
		}

		sess.Set("id", zauth_user.Id)
		sess.Set("username", zauth_user.Username)
		sess.Save()

		return c.Status(200).Redirect("/")
	})

	log.Println(app.Listen(":4000"))
}

func CreateDb() *sql.DB {
	// _foreign_keys=on because otherwise foreign key constraints are not checked
	db, _ := sql.Open("sqlite3", "file:zess.db?_foreign_keys=on")

	sqlStmt := `
		CREATE TABLE IF NOT EXISTS users (
			zauth_id INTEGER not null primary key
		);

		CREATE TABLE IF NOT EXISTS cards (
			serial text not null PRIMARY KEY UNIQUE,
			user INTEGER not null,
			FOREIGN KEY(user) REFERENCES users(zauth_id)
		);

		CREATE TABLE IF NOT EXISTS scans (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			scan_time text not null,
			serial text not null,
			FOREIGN KEY(serial) REFERENCES cards(serial)
		);
	`
	_, err := db.Exec(sqlStmt)

	if err != nil {
		log.Fatal(err)
	}

	return db
}
