package main

import (
	"encoding/gob"
	"os"
	"vingo/database"
	"vingo/handlers"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	gob.Register(handlers.StoreUser{})

	ZauthClientId, id_ok := os.LookupEnv("ZauthClientId")
	if !id_ok {
		ZauthClientId = "tomtest"
		log.Println("ZauthClientId not set, using default tomtest")
	}

	ZauthClientSecret, secret_ok := os.LookupEnv("ZauthClientSecret")
	if !secret_ok {
		ZauthClientSecret = "blargh"
		log.Println("ZauthClientSecret not set, using default blargh")
	}

	handlers.SetZauth(ZauthClientId, ZauthClientSecret)

	db := database.Get()
	defer db.Close()
	engine := html.New("./layouts", ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Get("/", handlers.Index)

	app.Get("/login", handlers.Login)
	app.Get("/logout", handlers.Logout)

	app.Get("/scans", handlers.Scans)
	// only from kelder?
	app.Post("/scans", handlers.ScanRegister)

	app.Get("/cards", handlers.Cards)
	// only from kelder?
	app.Post("/cards/register", handlers.StartCardRegister)

	app.Get("/auth/callback", handlers.Callback)

	log.Println(app.Listen(":4000"))
}
