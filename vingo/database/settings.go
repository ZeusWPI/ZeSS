package database

type Settings struct {
	ScanInOut   bool
	Leaderboard bool
	Public      bool
}

var (
	settingsCreateStmt = `
		CREATE TABLE IF NOT EXISTS settings (
			user_id INT NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
			public BOOLEAN NOT NULL DEFAULT FALSE,
			scan_in_out BOOLEAN NOT NULL DEFAULT FALSE,
			leaderboard BOOLEAN NOT NULL DEFAULT TRUE
		);
	`
)

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
