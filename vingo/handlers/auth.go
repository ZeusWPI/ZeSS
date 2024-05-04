package handlers

import (
	"crypto/rand"
	"log"
	"math/big"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

const (
	ZAUTH_URL     = "https://adams.ugent.be"
	CALLBACK_PATH = "/auth/callback" // TODO: hardcode ono
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
	sess.Set(ZAUTH_STATE, state.String())
	sess.Save()

	callback_url := c.BaseURL() + CALLBACK_PATH
	return c.Status(200).Redirect(ZAUTH_URL + "/oauth/authorize?client_id=" + ZauthClientId + "&response_type=code&state=" + state.String() + "&redirect_uri=" + callback_url)
}

func Logout(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	sess.Destroy()
	return c.Status(200).Redirect("/")
}

// oauth
func Callback(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Session error")
	}

	// Check if saved state matches the one returned by Zauth
	expected_state := sess.Get(ZAUTH_STATE).(string)
	received_state := c.Query("state")
	if expected_state != received_state {
		log.Println("State mismatch: got " + received_state + ", expected " + expected_state)
		return c.Status(400).SendString("State mismatch")
	}

	// Convert code into access token
	code := c.Query("code")

	args := fiber.AcquireArgs()
	defer fiber.ReleaseArgs(args)
	args.Set("grant_type", "authorization_code")
	args.Set("code", code)
	args.Set("redirect_uri", c.BaseURL()+CALLBACK_PATH)

	// Zauth access token
	type ZauthToken struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		ExpiresIn   int    `json:"expires_in"`
	}

	zauth_token := new(ZauthToken)
	status, _, errs := fiber.Post(ZAUTH_URL+"/oauth/token").BasicAuth(ZauthClientId, ZauthClientSecret).Form(args).Struct(zauth_token)
	if len(errs) > 0 || status != 200 {
		log.Println(status)
		log.Println(errs)
		return c.Status(500).SendString("Error fetching token")
	}

	// Zauth user info
	type ZauthUser struct {
		Id       int    `json:"id"`
		Username string `json:"username"`
	}

	zauth_user := new(ZauthUser)
	status, _, errs = fiber.Get(ZAUTH_URL+"/current_user").Set("Authorization", "Bearer "+zauth_token.AccessToken).Struct(zauth_user)
	if len(errs) > 0 || status != 200 {
		log.Println(status)
		log.Println(errs)
		return c.Status(500).SendString("Error fetching user")
	}

	// Insert user into database using the Zauth id
	err = database.CreateUserIfNew(zauth_user.Id)
	if err != nil {
		log.Println(err)
		return c.Status(500).SendString("Error inserting user")
	}

	sess.Regenerate()
	sess.Set(USER_ID, zauth_user.Id)
	sess.Set(USERNAME, zauth_user.Username)
	sess.Save()

	return c.Status(200).Redirect("/")
}
