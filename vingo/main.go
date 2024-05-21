package main

import (
	"encoding/gob"
	"os"
	"vingo/database"
	"vingo/handlers"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	gob.Register(handlers.StoreUser{})

	setupFromEnv()

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

func setupFromEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// stuff for Zauth oauth flow
	zauth_client_id, id_ok := os.LookupEnv("ZAUTH_CLIENT_ID")
	if !id_ok {
		log.Fatal("ZAUTH_CLIENT_ID environment variable not set")
	}

	zauth_client_secret, secret_ok := os.LookupEnv("ZAUHT_CLIENT_SECRET")
	if !secret_ok {
		log.Fatal("ZAUHT_CLIENT_SECRET environment variable not set")
	}

	handlers.SetZauth(zauth_client_id, zauth_client_secret)

	// PSK that will authorize the scanner
	scan_key, key_ok := os.LookupEnv("SCAN_KEY")
	if !key_ok {
		log.Fatal("SCAN_KEY environment variable not set")
	}

	handlers.SetScanKey(scan_key)

	// Database
	database_string, db_ok := os.LookupEnv("POSTGRES_CONNECTION_STRING")
	if !db_ok {
		log.Fatal("POSTGRES_CONNECTION_STRING environment variable not set")
	}

	database.OpenDatabase(database_string)
}
