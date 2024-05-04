package database

var (
	cardsCreateStmt = `
		CREATE TABLE IF NOT EXISTS cards (
			serial TEXT NOT NULL PRIMARY KEY UNIQUE,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
			user INTEGER NOT NULL,
			FOREIGN KEY(user) REFERENCES users(zauth_id)
		);
	`
)
