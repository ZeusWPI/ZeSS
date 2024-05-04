package database

type Scan struct {
	ScanTime string
	Serial   string
}

// Zauth access token
type Token struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

// Zauth user info
type User struct {
	Id       int    `json:"id"`
	Username string `json:"username"`
}
