package handlers

import (
	"strings"
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

var (
	scan_key = ""
)

func SetScanKey(key string) {
	scan_key = key
}

func ScanRegister(c *fiber.Ctx) error {
	// Check if the key is correct
	data := c.Body()
	s_data := strings.Split(string(data), ";")
	if len(s_data) != 2 {
		return c.Status(400).SendString("Invalid format: card_id;key")
	}

	card_serial := s_data[0]
	key := s_data[1]
	if key != scan_key {
		return c.Status(401).SendString("Invalid key")
	}

	// if card registering session is active, register the card instead of scanning
	if time.Now().Before(registering_end) {
		logger.Println("Registering card", card_serial, "for user", registering_user)

		err := database.CreateCard(card_serial, registering_user)
		// error or not, end registering session
		registering_user = 0
		registering_end = time.Now()

		if err != nil {
			logger.Println(err)
			return c.Status(500).SendString("Error registering card")
		}
		registering_success = true
		return c.SendString("Card registered")
	}

	// add scan to database
	err := database.CreateScan(card_serial)
	if err != nil {
		logger.Println(err)
		// technically only when error is foreign key constraint
		return c.Status(404).SendString("Card doesn't exist")
	}

	user, err := database.GetUserFromCard(card_serial)
	if err != nil {
		logger.Println(err)
		return c.Status(404).SendString("Card doesn't exist")
	}

	return c.SendString(user.Username)
}

func Scans(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	scans, err := database.GetScansForUser(user.Id)
	if err != nil {
		logger.Println("Error get scans:", err)
		return c.Status(500).SendString("Error getting scans")
	}

	return c.JSON(scans)
}
