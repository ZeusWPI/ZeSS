package database

func CreateCard(serial string, user_id int) error {
	return gorm_db.Create(&Card{Serial: serial, UserId: user_id}).Error
}

func GetCardsForUser(user_id int) ([]Card, error) {
	var cards []Card
	result := gorm_db.Where("user_id = ?", user_id).Find(&cards)
	return cards, result.Error
}

func GetCardsAndStatsForUser(user_id int) ([]CardAPI, error) {
	rows, err := db.Query(`
	SELECT cards.id, cards.created_at, serial, name, COUNT(scans.id), (select MAX(scan_time) from scans where card_serial = cards.serial) from cards LEFT JOIN scans on scans.card_serial = serial WHERE
	user_id = $1 GROUP BY cards.id;
	`, user_id)

	if err != nil {
		return nil, err
	}

	cards := []CardAPI{}
	for rows.Next() {
		var item CardAPI
		_ = rows.Scan(&item.Id, &item.CreatedAt, &item.Serial, &item.Name, &item.AmountUsed, &item.LastUsed)
		cards = append(cards, item)
	}

	return cards, nil
}

func UpdateCardName(id int, name string, user_id int) error {
	return gorm_db.Model(&Card{}).Where("id = ? AND user_id = ?", id, user_id).Update("name", name).Error
}
