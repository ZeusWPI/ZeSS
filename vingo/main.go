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
	gob.Register(database.User{})
	gob.Register(database.Settings{})

	setupFromEnv()

	db := database.Get()
	defer db.Close()

	engine := html.New("./layouts", ".html")
	public := fiber.New(fiber.Config{
		Views: engine,
	})

	// Public routes
	public.Get("/", handlers.Index)

	public.Get("/login", handlers.Login)
	public.Get("/auth/callback", handlers.Callback)

	public.Post("/scans", handlers.ScanRegister)

	// Logged in routes
	logged := public.Group("/", handlers.IsLoggedIn)
	{
		logged.Get("/logout", handlers.Logout)

		logged.Get("/scans", handlers.ScansPage)

		logged.Get("/cards", handlers.CardsPage)
		logged.Post("/cards/register", handlers.StartCardRegister)

		logged.Get("/leaderboard", handlers.LeaderboardPage)

		logged.Get("/settings", handlers.Settings)
		logged.Post("/settings", handlers.SettingsUpdate)
	}

	api := logged.Group("/api", handlers.IsLoggedInAPI)
	{
		api.Get("/user", handlers.User)
		api.Get("/leaderboard", handlers.Leaderboard)
		api.Get("/scans", handlers.Scans)
		api.Get("/cards", handlers.Cards)
		api.Get("/settings", handlers.Settings)
	}

	// Admin routes
	admin := logged.Group("/", handlers.IsAdmin)
	{
		admin.Get("/days", handlers.DaysPage)
		admin.Post("/days", handlers.DaysRegister)
		admin.Post("/days/:id", handlers.DaysDelete)
	}

	log.Println(public.Listen(":4000"))
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
