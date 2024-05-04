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

func CardScan(c *fiber.Ctx) error {
	data := c.Body()
	card_id := string(data)

	scan_insert, _ := db.Prepare("INSERT INTO scans (card) VALUES (?);")
	res, err := scan_insert.Exec(card_id)
	if err != nil {
		log.Println(err)
		// technically only when error is foreign key constraint
		return c.Status(404).SendString("Card doesn't exist")
	}

	log.Println(res)
	log.Println(card_id)
	return c.SendString("Card scanned")
}
