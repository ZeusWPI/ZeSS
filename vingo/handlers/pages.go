package handlers

import (
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func Index(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	if current_user != nil {
		return stats(c, current_user)
	} else {
		return landing(c)
	}
}

func landing(c *fiber.Ctx) error {
	return c.Render("landing", nil, "main")
}

func stats(c *fiber.Ctx, user *StoreUser) error {
	days, err := database.GetPresenceHistory(user.Id, 7)
	if err != nil {
		logger.Println("Error get presence history:", err)
		return c.Status(500).SendString("Error getting presence history")
	}

	return c.Render("stats", fiber.Map{"user": user, "days_present_7": days}, "main")
}

func Scans(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	if current_user == nil {
		return c.Status(401).Redirect("/login")
	}

	scans, err := database.GetScansForUser(current_user.Id)
	if err != nil {
		logger.Println("Error get scans:", err)
		return c.Status(500).SendString("Error getting scans")
	}

	return c.Render("scans", fiber.Map{"user": current_user, "scans": scans}, "main")
}

func Cards(c *fiber.Ctx) error {
	current_user := getUserFromStore(c)
	if current_user == nil {
		return c.Status(401).Redirect("/login")
	}

	cards, err := database.GetCardsForUser(current_user.Id)
	if err != nil {
		logger.Println("", err)
		return c.Status(500).SendString("Error getting cards")
	}

	registering := time.Now().Before(registering_end)
	registering_is_user := current_user.Id == registering_user

	return c.Render("cards", fiber.Map{"user": current_user, "cards": cards, "registering": registering, "reg_user": registering_is_user}, "main")
}
