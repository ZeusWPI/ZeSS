package handlers

import (
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

type Days struct{}

type DaysBody struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

func (Days) CreateMultiple(c *fiber.Ctx) error {
	payload := new(DaysBody)
	if err := c.BodyParser(payload); err != nil {
		logger.Println("Error parsing body:", err)
		return c.Status(400).SendString("Error parsing body")
	}

	err := database.CreateDays(payload.StartDate, payload.EndDate)
	if err != nil {
		logger.Println("Error creating days:", err)
		return c.Status(500).SendString("Error creating days")
	}

	return c.Redirect("/days")
}

func (Days) Delete(c *fiber.Ctx) error {
	day_id := c.Params("id")
	err := database.DeleteDay(day_id)
	if err != nil {
		logger.Println("Error deleting day:", err)
		return c.Status(500).SendString("Error deleting day")
	}

	return c.Redirect("/days")
}
