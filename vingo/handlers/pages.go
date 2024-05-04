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
	id := sess.Get(USER_ID)
	username := sess.Get(USERNAME)
	return c.Render("index", fiber.Map{"user_id": id, "username": username})
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

	return c.Render("scans", fiber.Map{"scans": scans})
}
