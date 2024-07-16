package database

func CreateCard(serial string, user_id int) error {
	return gorm_db.Create(&Card{Serial: serial, UserId: user_id}).Error
}

func GetCardsForUser(user_id int) ([]Card, error) {
	var cards []Card
	result := gorm_db.Where("user_id = ?", user_id).Find(&cards)
	return cards, result.Error
}

func SetCardName(id int, name string, user_id int) error {
	err := gorm_db.Model(&Card{}).Where("id = ? AND user_id = ?", id, user_id).Update("name", name).Error
	return err
}
