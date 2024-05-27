package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func StartCardRegister(c *fiber.Ctx) error {
	// keep track of the user that initiated the request in global state
	// since only one user can be registering a card at a time
	user := getUserFromStore(c)

	if time.Now().Before(registering_end) {
		return c.Status(400).SendString("Another user is already registering a card")
	}

	registering_user = user.Id
	registering_end = time.Now().Add(time.Minute)

	logger.Println("Card registration started by user", registering_user)

	return c.Status(200).Redirect("/cards")
}
