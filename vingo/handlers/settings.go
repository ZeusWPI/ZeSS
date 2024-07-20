package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

type Settings struct{}

func (Settings) Update(c *fiber.Ctx) error {
	user := getUserFromStore(c)

	settings := database.Settings{}
	err := c.BodyParser(&settings)
	if err != nil {
		logger.Println(err)
		return c.Status(400).SendString("Invalid payload")
	}

	sess, _ := store.Get(c)
	database.UpdateSettings(user.Id, settings)
	user, _ = database.GetUser(user.Id)
	sess.Set(STORE_USER, &user)
	sess.Save()

	return c.SendStatus(200)
}

func (Settings) Get(c *fiber.Ctx) error {
	user := getUserFromStore(c)
	return c.JSON(user.Settings)
}
