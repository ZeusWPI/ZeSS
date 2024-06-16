package handlers

import "github.com/gofiber/fiber/v2"

func User(c *fiber.Ctx) error {
	user := getUserFromStore(c)

	return c.JSON(user)
}
