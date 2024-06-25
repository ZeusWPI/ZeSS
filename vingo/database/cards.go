package database

import "time"

type Card struct {
	Id        int       `json:"id"`
	Serial    string    `json:"serial"`
	CreatedAt time.Time `json:"createdAt"`
	Name      string    `json:"name"`
}

func CreateCard(serial string, user_id int) error {
	_, err := db.Exec("INSERT INTO cards (serial, user_id) VALUES ($1, $2);", serial, user_id)
	return err
}

func GetCardsForUser(user_id int) ([]Card, error) {
	rows, err := db.Query("SELECT id, serial, created_at, name FROM cards WHERE user_id = $1;", user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var card Card
		err := rows.Scan(&card.Id, &card.Serial, &card.CreatedAt, &card.Name)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}

	return cards, nil
}

func SetCardName(id int, name string, user_id int) error {
	_, err := db.Exec("UPDATE cards SET name = $1 WHERE user_id = $2 and id = $3;", name, user_id, id)
	return err
}
