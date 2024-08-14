package handlers

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"vingo/database"

	"github.com/gofiber/fiber/v2"
)

var (
	ZauthURL          = ""
	ZauthCallbackPath = ""
	ZauthClientId     = ""
	ZauthClientSecret = ""
	ZauthRedirectUri  = ""
)

func SetZauth(url string, callback_path string, client_id string, client_secret string, redirect_uri string) {
	ZauthURL = url
	ZauthCallbackPath = callback_path
	ZauthClientId = client_id
	ZauthClientSecret = client_secret
	ZauthRedirectUri = redirect_uri
}

func Login(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		logger.Println("login:", err)
		return c.Status(500).SendString("Session error")
	}

	state, _ := rand.Int(rand.Reader, big.NewInt(1000000000))
	sess.Set(ZAUTH_STATE, state.String())
	sess.Save()

	callback_url := c.BaseURL() + ZauthCallbackPath
	return c.Status(200).Redirect(fmt.Sprintf("%s/oauth/authorize?client_id=%s&response_type=code&state=%s&redirect_uri=%s", ZauthURL, ZauthClientId, state.String(), callback_url))
}

func Logout(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		logger.Println("logout:", err)
		return c.Status(500).SendString("Session error")
	}

	sess.Destroy()
	return c.Status(200).Redirect(ZauthRedirectUri)
}

// Zauth access token
type ZauthToken struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

// Zauth user info
type ZauthUser struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
}

// oauth
func Callback(c *fiber.Ctx) error {
	sess, err := store.Get(c)
	if err != nil {
		logger.Println(err)
		return c.Status(500).SendString("Session error")
	}

	// Check if saved state matches the one returned by Zauth
	expected_state := sess.Get(ZAUTH_STATE).(string)
	received_state := c.Query("state")
	if expected_state != received_state {
		logger.Println("State mismatch: got", received_state, "expected", expected_state)
		return c.Status(400).SendString("State mismatch")
	}

	code := c.Query("code")

	args := fiber.AcquireArgs()
	defer fiber.ReleaseArgs(args)
	args.Set("grant_type", "authorization_code")
	args.Set("code", code)
	args.Set("redirect_uri", c.BaseURL()+ZauthCallbackPath)

	// Convert callback code into access token
	zauth_token := new(ZauthToken)
	status, _, errs := fiber.
		Post(ZauthURL+"/oauth/token").
		BasicAuth(ZauthClientId, ZauthClientSecret).
		Form(args).
		Struct(zauth_token)

	if len(errs) > 0 || status != 200 {
		logger.Println("Error callback code -> access token from Zauth")
		logger.Println(status)
		logger.Println(errs)
		return c.Status(500).SendString("Error fetching token")
	}

	// Get user info using access token
	zauth_user := new(ZauthUser)
	status, _, errs = fiber.
		Get(ZauthURL+"/current_user").
		Set("Authorization", "Bearer "+zauth_token.AccessToken).
		Struct(zauth_user)

	if len(errs) > 0 || status != 200 {
		logger.Println("Error fetching user info from Zauth")
		logger.Println(status)
		logger.Println(errs)
		return c.Status(500).SendString("Error fetching user")
	}

	// Insert user into database using the Zauth id
	err = database.CreateUserIfNew(zauth_user.Id, zauth_user.Username)
	if err != nil {
		logger.Println("Insert user:", err)
		return c.Status(500).SendString("Error inserting user")
	}

	user, err := database.GetUser(zauth_user.Id)
	if err != nil {
		logger.Println("Get user:", err)
		return c.Status(500).SendString("Error fetching user")
	}

	// Regenerate the session to set a new key
	sess.Regenerate()
	sess.Set(STORE_USER, &user)
	sess.Save()

	return c.Status(200).Redirect(ZauthRedirectUri)
}
