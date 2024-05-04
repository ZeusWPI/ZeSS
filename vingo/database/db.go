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

	// Tables to create
	createStmts := []string{usersCreateStmt, cardsCreateStmt, scansCreateStmt}
	for _, stmt := range createStmts {
		_, err := db.Exec(stmt)
		if err != nil {
			log.Println("Error creating table with query: \n", stmt)
			log.Fatal(err)
		}
	}

	return db
}

func Get() *sql.DB {
	return db
}
