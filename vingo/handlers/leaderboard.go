package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func Leaderboard(c *fiber.Ctx) error {
	users, err := database.TotalDaysPerUser()
	if err != nil {
		logger.Println("Error getting leaderboard:", err)
		return c.Status(500).SendString("Error getting leaderboard")
	}

	logger.Println(users)
	return c.JSON(users)
}
