package handlers

import "github.com/gofiber/fiber/v2"

func IsLoggedIn(c *fiber.Ctx) error {
	if getUserFromStore(c) == nil {
		return c.Redirect("/login")
	}

	return c.Next()
}

func IsLoggedInAPI(c *fiber.Ctx) error {
	if getUserFromStore(c) == nil {
		return c.Status(401).SendString("Unauthorized")
	}

	return c.Next()
}

func IsAdmin(c *fiber.Ctx) error {
	if !isAdmin(c) {
		return c.Status(403).SendString("Forbidden")
	}

	return c.Next()
}
