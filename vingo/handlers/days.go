package handlers

import (
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func DaysRegister(c *fiber.Ctx) error {
	form_start_date := c.FormValue("start_date")
	form_end_date := c.FormValue("end_date")

	start_date, start_err := time.Parse("2006-01-02", form_start_date)
	end_date, end_err := time.Parse("2006-01-02", form_end_date)
	if start_err != nil || end_err != nil {
		logger.Println("Error parsing dates:", start_err, end_err)
		return c.Status(400).SendString("Error parsing dates")
	}

	logger.Println("Registering days from", start_date, "to", end_date)
	err := database.CreateDays(start_date, end_date)
	if err != nil {
		logger.Println("Error creating days:", err)
		return c.Status(500).SendString("Error creating days")
	}

	return c.Redirect("/days")
}

func DaysDelete(c *fiber.Ctx) error {
	day_id := c.Params("id")
	logger.Println("Deleting day", day_id)
	err := database.DeleteDay(day_id)
	if err != nil {
		logger.Println("Error deleting day:", err)
		return c.Status(500).SendString("Error deleting day")
	}

	return c.Redirect("/days")
}
