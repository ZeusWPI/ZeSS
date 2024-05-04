package handlers

import (
	"log"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

// TODO: Make this work with an actual scanner
func CardRegister(c *fiber.Ctx) error {
	data := c.Body()
	card_id := string(data)

	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}
	user_id := sess.Get(USER_ID).(int)

	err = database.CreateCard(card_id, user_id)
	if err != nil {
		log.Println(err)
		// TODO: Check if the error is due to the card already being registered
		return c.Status(400).SendString("Card already registered")
	}

	return c.SendString("Card registered")
}
