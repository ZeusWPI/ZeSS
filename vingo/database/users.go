package database

type User struct {
	Id          int
	Username    string
	Admin       bool
	Leaderboard bool
	Public      bool
}

var (
	usersCreateStmt = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			username TEXT NOT NULL,
			admin BOOLEAN DEFAULT FALSE NOT NULL,
			leaderboard BOOLEAN DEFAULT FALSE NOT NULL,
			public BOOLEAN DEFAULT FALSE NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`
)

func CreateUserIfNew(user_id int, username string) error {
	_, err := db.Exec("INSERT INTO users (id, username) VALUES ($1, $2) ON CONFLICT DO NOTHING;", user_id, username)
	return err
}

func GetUser(user_id int) (*User, error) {
	return getUser("SELECT id, username, admin, leaderboard, public FROM users WHERE id = $1;", user_id)
}

func GetUserFromCard(card_serial string) (*User, error) {
	return getUser(`
		SELECT users.id, users.username, users.admin, users.leaderboard, users.public
		FROM users
		JOIN cards ON users.id = cards.user_id
		WHERE cards.serial = $1;
	`, card_serial)
}

func getUser(query string, args ...interface{}) (*User, error) {
	row := db.QueryRow(query, args...)
	user := new(User)
	err := row.Scan(&user.Id, &user.Username, &user.Admin, &user.Leaderboard, &user.Public)
	return user, err
}
