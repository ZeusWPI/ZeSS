package handlers

import (
	"log"
	"os"
	"time"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store  = session.New()
	logger = log.New(os.Stdout, "", log.Ldate|log.Ltime|log.Lshortfile)

	// State for registering a new card
	registering_user = 0
	registering_end  = time.Now()
)

const (
	STORE_USER  = "store_user"
	USER_ID     = "user_id"
	USERNAME    = "username"
	ZAUTH_STATE = "zauth_state"
)

func getUserFromStore(c *fiber.Ctx) *database.User {
	sess, err := store.Get(c)
	if err != nil {
		logger.Println(err)
		return nil
	}

	user := sess.Get(STORE_USER)
	logger.Println("User from store:", user)
	if user == nil {
		return nil
	}

	databaseUser := user.(database.User)
	return &databaseUser
}

func isAdmin(c *fiber.Ctx) bool {
	user := getUserFromStore(c)
	logger.Println("Is admin:", user)
	if user == nil {
		return false
	}

	return user.Admin
}
