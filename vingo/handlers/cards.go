package handlers

import (
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func StartCardRegisterAPI(c *fiber.Ctx) error {
	user := getUserFromStore(c)

	if time.Now().Before(registering_end) {
		// true if current user is already registering
		return c.Status(503).JSON(map[string]bool{"is_current_user": registering_user == user.Id})
	}

	registering_user = user.Id
	registering_end = time.Now().Add(time.Minute)

	logger.Println("Card registration started by user", registering_user)

	return c.Status(200).JSON(map[string]bool{})
}

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

func Cards(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	cards, err := database.GetCardsForUser(user.Id)
	if err != nil {
		logger.Println("", err)
		return c.Status(500).SendString("Error getting cards")
	}

	return c.JSON(cards)
}
