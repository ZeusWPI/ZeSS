package main

import (
	"log"
	"strconv"

	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	engine := html.New("./layouts", ".html")
	db, _ := sql.Open("sqlite3", "file:zess.db?_foreign_keys=on")
	defer db.Close()

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
		log.Println(err)
	}

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", fiber.Map{})
	})

	app.Post("/register", func(c *fiber.Ctx) error {
		data := c.FormValue("zauth_id")
		zauth_id, err := strconv.Atoi(data)
		log.Println(zauth_id)
		if err != nil {
			log.Println(err)
			return c.Status(400).SendString("Invalid zauth_id")
		}

		user_insert, _ := db.Prepare("INSERT INTO users (zauth_id) VALUES (?);")
		_, err = user_insert.Exec(zauth_id)
		if err != nil {
			log.Println(err)
			return c.Status(400).SendString("User already registered")
		}

		return c.Status(200).Redirect("/")
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
