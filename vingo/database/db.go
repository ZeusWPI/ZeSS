package database

import (
	"database/sql"
	"log"
)

var (
	db = CreateDb()
)

func CreateDb() *sql.DB {
	// _foreign_keys=on because otherwise foreign key constraints are not checked
	db, _ := sql.Open("sqlite3", "file:zess.db?_foreign_keys=on")

	sqlStmt := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER NOT NULL PRIMARY KEY,
			admin INTEGER DEFAULT FALSE NOT NULL,
			leaderboard BOOLEAN DEFAULT FALSE NOT NULL,
			public BOOLEAN DEFAULT FALSE NOT NULL,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
		);

		CREATE TABLE IF NOT EXISTS cards (
			serial TEXT NOT NULL PRIMARY KEY UNIQUE,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
			user INTEGER NOT NULL,
			FOREIGN KEY(user) REFERENCES users(zauth_id)
		);

		CREATE TABLE IF NOT EXISTS scans (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			scan_time TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
			card TEXT NOT NULL,
			FOREIGN KEY(card) REFERENCES cards(serial)
		);
	`
	_, err := db.Exec(sqlStmt)

	if err != nil {
		log.Fatal(err)
	}

	return db
}

func Get() *sql.DB {
	return db
}
