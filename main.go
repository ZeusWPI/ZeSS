package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"database/sql"

	"github.com/mattn/go-sqlite3"
)

var DB *sql.DB

type Person struct {
	Id         int    `json:"id"`
	FirstName      string `json:"first_name"`
	LastName    string `json:"last_name"`
	Email string   `json:"email"`
	IpAddress string `json:"ip_address"`
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// Ping test
	r.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	return r
}

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}

func 

func ConnectDatabase() error {
	db, err := sql.Open("sqlite3", "./names.db")
	if err != nil {
		return err
	}

	DB = db
	return nil
}
