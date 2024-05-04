package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store = session.New()
	db    = database.Get()
)
