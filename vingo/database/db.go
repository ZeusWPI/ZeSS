package database

import (
	"database/sql"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db      *sql.DB
	gorm_db *gorm.DB
)

func Get() *sql.DB {
	return db
}

func OpenDatabase(db_string string) {
	new_db, err := gorm.Open(postgres.Open(db_string), &gorm.Config{})
	if err != nil {
		log.Println("Error opening database connection")
		log.Fatal(err)
	}

	err = new_db.AutoMigrate()
	if err != nil {
		log.Println("Error migrating database")
		log.Fatal(err)
	}

	err = new_db.AutoMigrate(&User{}, &Card{}, &Scan{}, &StreakDay{}, &Settings{}, &Season{})
	if err != nil {
		log.Println("Error migrating database")
		log.Fatal(err)
	}

	gorm_db = new_db
	db, _ = new_db.DB()
}
