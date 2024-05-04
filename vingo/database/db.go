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
			zauth_id INTEGER not null primary key
		);

		CREATE TABLE IF NOT EXISTS cards (
			serial text not null PRIMARY KEY UNIQUE,
			user INTEGER not null,
			FOREIGN KEY(user) REFERENCES users(zauth_id)
		);

		CREATE TABLE IF NOT EXISTS scans (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			scan_time text not null,
			serial text not null,
			FOREIGN KEY(serial) REFERENCES cards(serial)
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
