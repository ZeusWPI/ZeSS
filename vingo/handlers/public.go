package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func PublicRecentScans(c *fiber.Ctx) error {
	scans, err := database.GetRecentScans()

	if err != nil {
		logger.Println("Error get recent scans:", err)
		return c.Status(500).SendString("Error getting recent scans")
	}

	return c.JSON(scans)
}
