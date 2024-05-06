package handlers

import (
	"time"
	"vingo/database"

	"log"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	return c.Render("index", fiber.Map{"user": current_user}, "main")
}

func Scans(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	if current_user == nil {
		return c.Status(401).Redirect("/login")
	}

	scans, err := database.GetScansForUser(current_user.Id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error getting scans")
	}

	return c.Render("scans", fiber.Map{"user": current_user, "scans": scans}, "main")
}

func Cards(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	if current_user == nil {
		return c.Status(401).Redirect("/login")
	}

	cards, err := database.GetCardsForUser(current_user.Id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error getting cards")
	}

	registering := time.Now().Before(registering_end)

	return c.Render("cards", fiber.Map{"user": current_user, "cards": cards, "registering": registering}, "main")
}
