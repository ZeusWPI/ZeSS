package handlers

import (
	"log"
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func ScanRegister(c *fiber.Ctx) error {
	data := c.Body()
	card_id := string(data)

	// if card registering session is active, register the card instead of scanning
	if time.Now().Before(registering_end) {
		log.Println("Registering card", card_id, "for user", registering_user)
		err := database.CreateCard(card_id, registering_user)
		if err != nil {
			log.Println(err)
			return c.Status(500).SendString("Error registering card")
		}
		return c.SendString("Card registered")
	}

	// register card scan
	err := database.CreateScan(card_id)
	if err != nil {
		log.Println(err)
		// technically only when error is foreign key constraint
		return c.Status(404).SendString("Card doesn't exist")
	}

	return c.SendString("Card scanned")
}
