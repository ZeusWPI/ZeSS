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

var corsAllowOrigins = ""

func main() {
	gob.Register(database.User{})
	gob.Register(database.Settings{})

	setupFromEnv()

	db := database.Get()
	defer db.Close()

	public := fiber.New(fiber.Config{})

	public.Use(cors.New(cors.Config{
		AllowOrigins:     corsAllowOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Access-Control-Allow-Origin",
		AllowCredentials: true,
	}))

	// Public routes
	public.Post("/login", handlers.Login)
	public.Get("/auth/callback", handlers.Callback)

	public.Post("/scans", handlers.ScanRegister)

	public.Get("/recent_scans", handlers.PublicRecentScans)

	api := public.Group("/api", handlers.IsLoggedIn)
	{
		api.Post("/logout", handlers.Logout)
		api.Get("/user", handlers.User)
		api.Get("/leaderboard", handlers.Leaderboard)
		api.Get("/scans", handlers.Scans)

		api.Get("/cards", handlers.Cards{}.Get)
		api.Patch("/cards/:id", handlers.Cards{}.Update)
		api.Get("/cards/register", handlers.Cards{}.RegisterStatus)
		api.Post("/cards/register", handlers.Cards{}.StartRegister)

		api.Get("/settings", handlers.Settings{}.Get)
		api.Patch("/settings", handlers.Settings{}.Update)

		admin := api.Group("/admin", handlers.IsAdmin)
		{
			admin.Get("/days", handlers.Days{}.All)
			admin.Post("/days", handlers.Days{}.CreateMultiple)
			admin.Delete("/days/:id", handlers.Days{}.Delete)
		}
	}

	log.Println(public.Listen(":4000"))
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

	handlers.SetZauth(zauth_client_id, zauth_client_secret, zauth_redirect_uri)

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
