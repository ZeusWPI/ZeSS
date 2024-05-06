package handlers

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var (
	store = session.New()

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

type StoreUser struct {
	Id       int
	Username string
}

func getUserFromStore(c *fiber.Ctx) *StoreUser {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return nil
	}

	user := sess.Get(STORE_USER)
	log.Println("User from store:", user)
	if user == nil {
		return nil
	}

	storeUser := user.(StoreUser)
	return &storeUser
}
