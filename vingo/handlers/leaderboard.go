package handlers

import (
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func Leaderboard(c *fiber.Ctx) error {
	users, err := database.TotalDaysPerUser(time.Now())
	if err != nil {
		logger.Println("Error getting leaderboard:", err)
		return c.Status(500).SendString("Error getting leaderboard")
	}

	users_last_week, err := database.TotalDaysPerUser(time.Now().AddDate(0, 0, -7))
	if err != nil {
		logger.Println("Error getting leaderboard:", err)
		return c.Status(500).SendString("Error getting leaderboard")
	}

	for i, user := range users {
		for _, user_last_week := range users_last_week {
			if user.UserId == user_last_week.UserId {
				users[i].PositionChange = user_last_week.Position - user.Position
				break
			}
		}
	}

	return c.JSON(users)
}
