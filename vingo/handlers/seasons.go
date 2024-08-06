package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

type Seasons struct{}

func (Seasons) Get(c *fiber.Ctx) error {
	seasons, err := database.Season{}.GetAll()
	if err != nil {
		logger.Println(err)
		return c.Status(500).SendString("Error getting seasons")
	}

	return c.JSON(seasons)
}

func (Seasons) Create(c *fiber.Ctx) error {
	season := database.Season{}
	err := c.BodyParser(&season)
	if err != nil {
		logger.Println(err)
		return c.Status(400).SendString("Invalid payload")
	}

	err = season.Create()
	if err != nil {
		logger.Println(err)
		return c.Status(500).SendString("Error creating season")
	}

	return c.SendStatus(200)
}
