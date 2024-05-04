package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func CardRegister(c *fiber.Ctx) error {
	data := c.Body()
	card_id := string(data)

	// TODO: fix user
	card_insert, _ := db.Prepare("INSERT INTO cards (serial, user) VALUES (?, 1234);")
	_, err := card_insert.Exec(card_id)
	if err != nil {
		log.Println(err)
		return c.Status(400).SendString("Card already registered")
	}

	return c.SendString("Card registered")
}
