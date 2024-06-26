package database

type Settings struct {
	ScanInOut   bool `json:"scanInOut"`
	Leaderboard bool `json:"leaderboard"`
	Public      bool `json:"public"`
}

func CreateSettings(user_id int) error {
	_, err := db.Exec("INSERT INTO settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING;", user_id)
	return err
}

func GetSettings(user_id int) (*Settings, error) {
	row := db.QueryRow("SELECT scan_in_out, leaderboard, public FROM settings WHERE user_id = $1;", user_id)
	settings := new(Settings)
	err := row.Scan(&settings.ScanInOut, &settings.Leaderboard, &settings.Public)
	return settings, err
}

func UpdateSettings(user_id int, settings Settings) error {
	_, err := db.Exec("UPDATE settings SET scan_in_out = $1, leaderboard = $2, public = $3 WHERE user_id = $4;", settings.ScanInOut, settings.Leaderboard, settings.Public, user_id)
	return err
}
