package database

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
