package database

type User struct {
	Id       int
	Username string
	Admin    bool
	Settings Settings
}

var (
	usersCreateStmt = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			username TEXT NOT NULL,
			admin BOOLEAN DEFAULT FALSE NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`
)

func CreateUserIfNew(user_id int, username string) error {
	_, err := db.Exec("INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;", user_id, username)
	if err != nil {
		return err
	}

	err = CreateSettings(user_id)
	return err
}

func GetUser(user_id int) (*User, error) {
	return getUser("SELECT id, username, admin, scan_in_out, leaderboard, public FROM users JOIN settings on id = user_id WHERE id = $1;", user_id)
}

func GetUserFromCard(card_serial string) (*User, error) {
	row := db.QueryRow(`
		SELECT users.id, users.username, users.admin, users.leaderboard, users.public
		FROM users
		JOIN cards ON users.id = cards.user_id
		WHERE cards.serial = $1;
	`, card_serial)
	user := new(User)
	err := row.Scan(&user.Id, &user.Username, &user.Admin)
	return user, err
}

func getUser(query string, args ...interface{}) (*User, error) {
	row := db.QueryRow(query, args...)
	user := new(User)
	settings := new(Settings)
	err := row.Scan(&user.Id, &user.Username, &user.Admin, &settings.ScanInOut, &settings.Leaderboard, &settings.Public)

	user.Settings = *settings
	return user, err
}
