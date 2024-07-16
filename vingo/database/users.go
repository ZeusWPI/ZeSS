package database

import "time"

func CreateUserIfNew(user_id int, username string) error {
	var user = &User{Username: username, Settings: Settings{ScanInOut: false, Leaderboard: true, Public: false}}
	user.Id = user_id
	user.Settings.CreatedAt = time.Now()
	user.Settings.UpdatedAt = time.Now()
	result := gorm_db.FirstOrCreate(&user)
	return result.Error
}

func GetUser(user_id int) (*User, error) {
	var user User
	result := gorm_db.First(&user, user_id)
	return &user, result.Error
}

func GetUserFromCard(card_serial string) (*User, error) {
	var card Card
	result := gorm_db.First(&card, "serial = ?", card_serial)
	return &card.User, result.Error
}
