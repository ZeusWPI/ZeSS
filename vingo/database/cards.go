package database

import "time"

type Card struct {
	Serial    string    `json:"serial"`
	CreatedAt time.Time `json:"createdAt"`
}

var (
	cardsCreateStmt = `
		CREATE TABLE IF NOT EXISTS cards (
			serial TEXT NOT NULL PRIMARY KEY UNIQUE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
			user_id INTEGER NOT NULL REFERENCES users(id)
		);
	`
)

func CreateCard(serial string, user_id int) error {
	_, err := db.Exec("INSERT INTO cards (serial, user_id) VALUES ($1, $2);", serial, user_id)
	return err
}

func GetCardsForUser(user_id int) ([]Card, error) {
	rows, err := db.Query("SELECT serial, created_at FROM cards WHERE user_id = $1;", user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var card Card
		err := rows.Scan(&card.Serial, &card.CreatedAt)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	return cards, nil
}
