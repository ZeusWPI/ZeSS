package handlers

import (
	"vingo/database"

	"log"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)

	username := ""
	if current_user != nil {
		username = current_user.Username
	}

	return c.Render("index", fiber.Map{"username": username}, "main")
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

	return c.Render("scans", fiber.Map{"username": current_user.Username, "scans": scans}, "main")
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

	return c.Render("cards", fiber.Map{"username": current_user.Username, "cards": cards}, "main")
}
