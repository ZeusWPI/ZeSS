package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

func SettingsUpdate(c *fiber.Ctx) error {
	user := getUserFromStore(c)

	scan_in_out := c.FormValue("scan_in_out")
	leaderboard := c.FormValue("leaderboard")
	public := c.FormValue("public")

	if scan_in_out == "" || leaderboard == "" || public == "" {
		return c.Status(400).SendString("Missing fields")
	}

	settings := database.Settings{
		ScanInOut:   scan_in_out == "on",
		Leaderboard: leaderboard == "on",
		Public:      public == "on",
	}

	sess, _ := store.Get(c)
	database.UpdateSettings(user.Id, settings)
	user, _ = database.GetUser(user.Id)
	sess.Set(STORE_USER, &user)
	sess.Save()

	return c.Redirect("/settings")
}

func Settings(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	settings, err := database.GetSettings(user.Id)
	if err != nil {
		logger.Println(err)
		return c.Status(500).SendString("Error getting settings")
	}

	return c.JSON(settings)
}
