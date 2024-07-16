package handlers

import (
	"strconv"
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func StartCardRegister(c *fiber.Ctx) error {
	user := getUserFromStore(c)

	if time.Now().Before(registering_end) {
		// true if current user is already registering
		return c.Status(503).JSON(map[string]bool{"isCurrentUser": registering_user == user.Id})
	}

	registering_user = user.Id
	registering_end = time.Now().Add(time.Minute)

	logger.Println("Card registration started by user", registering_user)

	return c.Status(200).JSON(map[string]bool{})
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

func CardRegisterStatus(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	register_ongoing := time.Now().Before(registering_end)
	is_current_user := registering_user == user.Id
	return c.JSON(map[string]bool{"registering": register_ongoing, "isCurrentUser": is_current_user})
}

func CardNameUpdate(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	card_id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		logger.Println(err)
		return c.Status(400).SendString("Invalid card id")
	}

	payload := struct {
		Name string `json:"name"`
	}{}
	c.BodyParser(&payload)

	err = database.UpdateCardName(card_id, payload.Name, user.Id)
	if err != nil {
		logger.Println(err)
		return c.Status(500).SendString("Error updating card name")
	}

	return c.SendString("Card name updated")
}
