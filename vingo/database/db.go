package database

import (
	"database/sql"
	"log"
)

var (
	db *sql.DB
)

func createTables() {
	// Tables to create
	createStmts := []string{usersCreateStmt, cardsCreateStmt, scansCreateStmt, daysCreateStmt}
	for _, stmt := range createStmts {
		_, err := db.Exec(stmt)
		if err != nil {
			log.Println("Error creating table with query: \n", stmt)
			log.Fatal(err)
		}
	}
}

func Get() *sql.DB {
	return db
}

func OpenDatabase(conn string) {
	new_db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Panicln("Error opening database connection")
		log.Fatal(err)
	}
	db = new_db
	createTables()
}
