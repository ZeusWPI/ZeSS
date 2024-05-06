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

	zauth_client_id, zauth_client_secret := getConfigFromEnv()
	handlers.SetZauth(zauth_client_id, zauth_client_secret)

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

func getConfigFromEnv() (string, string) {
	// stuff for Zauth oauth flow
	zauth_client_id, id_ok := os.LookupEnv("ZAUTH_CLIENT_ID")
	if !id_ok {
		log.Fatal("ZAUTH_CLIENT_ID environment variable not set")
	}

	zauth_client_secret, secret_ok := os.LookupEnv("ZAUHT_CLIENT_SECRET")
	if !secret_ok {
		log.Fatal("ZAUHT_CLIENT_SECRET environment variable not set")
	}

	return zauth_client_id, zauth_client_secret
}
