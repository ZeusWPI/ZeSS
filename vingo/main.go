package main

import (
	"encoding/gob"
	"os"
	"vingo/database"
	"vingo/handlers"

	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var corsAllowOrigins string

func main() {
	gob.Register(database.User{})
	gob.Register(database.Settings{})

	setupFromEnv()

	db := database.Get()
	defer db.Close()

	api := fiber.New(fiber.Config{})

	api.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Access-Control-Allow-Origin",
		AllowCredentials: true,
	}))

	// Public routes
	{
		api.Post("/login", handlers.Login)
		api.Get("/auth/callback", handlers.Callback)

		api.Post("/scans", handlers.ScanRegister)

		api.Get("/recent_scans", handlers.PublicRecentScans)

		authed := api.Group("", handlers.IsLoggedIn)
		{
			authed.Post("/logout", handlers.Logout)
			authed.Get("/user", handlers.User)
			authed.Get("/leaderboard", handlers.Leaderboard)
			authed.Get("/scans", handlers.Scans)

			authed.Get("/cards", handlers.Cards{}.Get)
			authed.Patch("/cards/:id", handlers.Cards{}.Update)
			authed.Get("/cards/register", handlers.Cards{}.RegisterStatus)
			authed.Post("/cards/register", handlers.Cards{}.StartRegister)

			authed.Get("/settings", handlers.Settings{}.Get)
			authed.Patch("/settings", handlers.Settings{}.Update)

			admin := authed.Group("/admin", handlers.IsAdmin)
			{
				admin.Get("/days", handlers.Days{}.All)
				admin.Post("/days", handlers.Days{}.CreateMultiple)
				admin.Delete("/days/:id", handlers.Days{}.Delete)
			}
		}
	}

	log.Println(api.Listen(":4000"))
}

func setupFromEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	cors_allow_origins, origins_ok := os.LookupEnv("CORS_ALLOW_ORIGINS")
	if !origins_ok {
		log.Fatal("CORS_ALLOW_ORIGINS environment variable not set")
	}
	corsAllowOrigins = cors_allow_origins

	// stuff for Zauth oauth flow

	zauth_url, url_ok := os.LookupEnv("ZAUTH_URL")
	if !url_ok {
		log.Fatal("ZAUTH_URL environment variable not set")
	}

	zauth_callback_path, callback_ok := os.LookupEnv("ZAUTH_CALLBACK_PATH")
	if !callback_ok {
		log.Fatal("ZAUTH_CALLBACK_PATH environment variable not set")
	}

	zauth_client_id, id_ok := os.LookupEnv("ZAUTH_CLIENT_ID")
	if !id_ok {
		log.Fatal("ZAUTH_CLIENT_ID environment variable not set")
	}

	zauth_client_secret, secret_ok := os.LookupEnv("ZAUTH_CLIENT_SECRET")
	if !secret_ok {
		log.Fatal("ZAUTH_CLIENT_SECRET environment variable not set")
	}

	zauth_redirect_uri, redirect_ok := os.LookupEnv("ZAUTH_REDIRECT_URI")
	if !redirect_ok {
		log.Fatal("ZAUTH_REDIRECT_URI environment variable not set")
	}

	handlers.SetZauth(zauth_url, zauth_callback_path, zauth_client_id, zauth_client_secret, zauth_redirect_uri)

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
