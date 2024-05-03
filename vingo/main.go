package main

import (
	"log"

	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/template/html/v2"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
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
		zauth_id := sess.Get("zauth_id")
		return c.Render("index", fiber.Map{"zauth_id": zauth_id})
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		sess, err := store.Get(c)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Session error")
		}
		zauth_id := c.FormValue("zauth_id")
		sess.Set("zauth_id", zauth_id)
		sess.Save()

		return c.Status(200).Redirect("/")
	})

	app.Post("/register", func(c *fiber.Ctx) error {
		zauth_id := c.FormValue("zauth_id")

		user_insert, _ := db.Prepare("INSERT INTO users (zauth_id) VALUES (?);")
		_, err := user_insert.Exec(zauth_id)
		if err != nil {
			log.Println(err)
			return c.Status(400).SendString("User already registered")
		}

		return c.Status(200).Redirect("/")
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
		zauth_id := sess.Get("zauth_id")

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
		return c.SendString("Hello, World!")
	})

	log.Println(app.Listen(":3000"))
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
