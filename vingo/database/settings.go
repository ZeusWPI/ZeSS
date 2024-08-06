package database

import "log"

func GetSettings(user_id int) (*Settings, error) {
	var user User
	result := gorm_db.Preload("Settings").First(&user, user_id)
	log.Println(user)
	return &user.Settings, result.Error
}

func UpdateSettings(user_id int, settings Settings) error {
	var user User
	if err := gorm_db.Preload("Settings").First(&user, user_id).Error; err != nil {
		return err
	}

	user.Settings.ScanInOut = settings.ScanInOut
	user.Settings.Leaderboard = settings.Leaderboard
	user.Settings.Public = settings.Public
	if err := gorm_db.Save(&user.Settings).Error; err != nil {
		return err
	}

	return nil
}
