package database

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

var (
	db *sql.DB
)

func Get() *sql.DB {
	return db
}

func OpenDatabase(conn string) {
	new_db, err := sql.Open("postgres", conn)
	if err != nil {
		log.Println("Error opening database connection")
		log.Fatal(err)
	}

	driver, err := postgres.WithInstance(new_db, &postgres.Config{})
	if err != nil {
		log.Println("Error creating migration driver")
		log.Fatal(err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://database/migrations",
		"postgres", driver)
	if err != nil {
		log.Println("Error creating migration instance")
		log.Fatal(err)
	}

	err = m.Up()
	if err != nil && err != migrate.ErrNoChange {
		log.Println("Error running migrations")
		log.Fatal(err)
	}

	db = new_db
}
