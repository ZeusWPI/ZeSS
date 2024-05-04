package handlers

import (
	"vingo/database"

	"crypto/rand"
	"log"
	"math/big"

	"github.com/gofiber/fiber/v2"
)

var (
	ZauthClientId     = ""
	ZauthClientSecret = ""
)

func SetZauth(client_id string, client_secret string) {
	ZauthClientId = client_id
	ZauthClientSecret = client_secret
}

func Login(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	state, _ := rand.Int(rand.Reader, big.NewInt(1000000000))
	sess.Set("state", state.String())
	sess.Save()

	return c.Status(200).Redirect("https://adams.ugent.be/oauth/authorize?client_id=" + ZauthClientId + "&response_type=code&state=" + state.String() + "&redirect_uri=http://localhost:4000/auth/callback")
}

// oauth
func Callback(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	// Check if saved state matches the one returned by Zauth
	expected_state := sess.Get("state")
	actual_state := c.Query("state")
	if expected_state != actual_state {
		log.Println("State mismatch")
		return c.Status(400).SendString("State mismatch")
	}

	// Convert code into access token
	code := c.Query("code")

	args := fiber.AcquireArgs()
	defer fiber.ReleaseArgs(args)
	args.Set("grant_type", "authorization_code")
	args.Set("code", code)
	args.Set("redirect_uri", "http://localhost:4000/auth/callback")

	zauth_token := new(database.Token)
	status, _, errs := fiber.Post("https://adams.ugent.be/oauth/token").BasicAuth(ZauthClientId, ZauthClientSecret).Form(args).Struct(zauth_token)
	if len(errs) > 0 || status != 200 {
		log.Println(status)
		log.Println(errs)
		return c.Status(500).SendString("Error fetching token")
	}

	zauth_user := new(database.User)
	status, _, errs = fiber.Get("https://adams.ugent.be/current_user").Set("Authorization", "Bearer "+zauth_token.AccessToken).Struct(zauth_user)
	if len(errs) > 0 || status != 200 {
		log.Println(status)
		log.Println(errs)
		return c.Status(500).SendString("Error fetching user")
	}

	// Insert user into database using the Zauth id
	_, err = db.Exec("INSERT OR IGNORE INTO users (id) VALUES (?);", zauth_user.Id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error inserting user")
	}

	sess.Set("id", zauth_user.Id)
	sess.Set("username", zauth_user.Username)
	sess.Save()

	return c.Status(200).Redirect("/")
}
