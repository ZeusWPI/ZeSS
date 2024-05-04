package database

var (
	usersCreateStmt = `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER NOT NULL PRIMARY KEY,
			admin INTEGER DEFAULT FALSE NOT NULL,
			leaderboard BOOLEAN DEFAULT FALSE NOT NULL,
			public BOOLEAN DEFAULT FALSE NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
		);
	`
)

func CreateUserIfNew(user_id int) error {
	_, err := db.Exec("INSERT OR IGNORE INTO users (id) VALUES (?);", user_id)
	return err
}
