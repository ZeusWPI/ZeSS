package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store = session.New()

	// State for registering a new card
	registering_user = 0
	registering_end  = time.Now()
)

const (
	USER_ID     = "user_id"
	USERNAME    = "username"
	ZAUTH_STATE = "zauth_state"
)
