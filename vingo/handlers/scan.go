package handlers

import (
	"log"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func ScanRegister(c *fiber.Ctx) error {
	data := c.Body()
	card_id := string(data)

	err := database.CreateScan(card_id)
	if err != nil {
		log.Println(err)
		// technically only when error is foreign key constraint
		return c.Status(404).SendString("Card doesn't exist")
	}

	return c.SendString("Card scanned")
}
