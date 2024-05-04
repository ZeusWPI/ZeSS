package handlers

import (
	"vingo/database"

	"log"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}
	username := sess.Get(USERNAME)
	return c.Render("index", fiber.Map{"username": username}, "main")
}

func Scans(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	user_id := sess.Get(USER_ID).(int)
	scans, err := database.GetScansForUser(user_id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error getting scans")
	}

	username := sess.Get(USERNAME)
	return c.Render("scans", fiber.Map{"username": username, "scans": scans}, "main")
}

func Cards(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	user_id := sess.Get(USER_ID).(int)
	cards, err := database.GetCardsForUser(user_id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error getting cards")
	}

	username := sess.Get(USERNAME)
	return c.Render("cards", fiber.Map{"username": username, "cards": cards}, "main")
}
