package database

func CreateSettings(user_id int) error {
	_, err := db.Exec("INSERT INTO settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING;", user_id)
	return err
}

func GetSettings(user_id int) (*Settings, error) {
	var settings Settings
	result := gorm_db.First(&settings, "user_id = ?", user_id)
	return &settings, result.Error
}

func UpdateSettings(user_id int, settings Settings) error {
	_, err := db.Exec("UPDATE settings SET scan_in_out = $1, leaderboard = $2, public = $3 WHERE user_id = $4;", settings.ScanInOut, settings.Leaderboard, settings.Public, user_id)
	return err
}
