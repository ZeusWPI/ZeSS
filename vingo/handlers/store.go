package handlers

import (
	"vingo/database"

	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store = session.New()
	db    = database.Get()
)

const (
	USER_ID     = "user_id"
	USERNAME    = "username"
	ZAUTH_STATE = "zauth_state"
)
