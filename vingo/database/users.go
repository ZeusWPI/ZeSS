package database

var (
	usersCreateStmt = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER NOT NULL PRIMARY KEY,
			username TEXT NOT NULL,
			admin INTEGER DEFAULT FALSE NOT NULL,
			leaderboard BOOLEAN DEFAULT FALSE NOT NULL,
			public BOOLEAN DEFAULT FALSE NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`
)

func CreateUserIfNew(user_id int, username string) error {
	_, err := db.Exec("INSERT OR IGNORE INTO users (id, username) VALUES (?, ?);", user_id, username)
	return err
}
