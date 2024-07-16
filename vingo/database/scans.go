package database

import (
	"time"
)

type Present struct {
	Date      time.Time
	Present   bool
	StreakDay bool
}

type LeaderboardItem struct {
	Position  int    `json:"position"`
	Username  string `json:"username"`
	TotalDays int    `json:"totalDays"`
}

func CreateScan(card_serial string) error {
	return gorm_db.Create(&Scan{ScanTime: time.Now(), CardSerial: card_serial}).Error
}

func GetScansForUser(user_id int) ([]Scan, error) {
	var user User
	result := gorm_db.First(&user, user_id)

	var scans []Scan
	for _, card := range user.Cards {
		scans = append(scans, card.Scans...)
	}

	return scans, result.Error
}

func GetPresenceHistory(user_id int) ([]Present, error) {
	rows, err := db.Query(`
		WITH date_series AS (
			SELECT generate_series(CURRENT_DATE AT TIME ZONE 'Europe/Brussels' - INTERVAL '6 days', CURRENT_DATE AT TIME ZONE 'Europe/Brussels', '1 day')::date AS date
		)
		SELECT
			ds.date,
			CASE WHEN scans.scan_date IS NOT NULL THEN TRUE ELSE FALSE END AS present,
			CASE WHEN days.date IS NOT NULL THEN TRUE ELSE FALSE END AS streak_day
		FROM date_series ds
		LEFT JOIN (
			SELECT DISTINCT ((scan_time - INTERVAL '4 hours') AT TIME ZONE 'Europe/Brussels')::date AS scan_date
			FROM scans
			LEFT JOIN cards
			ON card_serial = serial
			WHERE user_id = $1
		) scans
		ON ds.date = scans.scan_date
		LEFT JOIN days
		ON ds.date = days.date
		ORDER BY ds.date DESC;
	`, user_id)
	if err != nil {
		return nil, err
	}

	presences := []Present{}
	for rows.Next() {
		var present Present
		_ = rows.Scan(&present.Date, &present.Present, &present.StreakDay)

		presences = append(presences, present)
	}

	return presences, nil
}

func TotalDaysPerUser() ([]LeaderboardItem, error) {
	rows, err := db.Query(`
	SELECT count, username, RANK() OVER (ORDER BY count desc) AS position
	FROM (SELECT COUNT(DISTINCT ((scan_time - INTERVAL '4 hours') AT TIME ZONE 'Europe/Brussels')::date), username
		FROM scans
			LEFT JOIN cards ON card_serial = serial
			LEFT JOIN users ON user_id = users.id
			GROUP BY username);
	`)

	if err != nil {
		return nil, err
	}

	leaderboard := []LeaderboardItem{}
	for rows.Next() {
		var item LeaderboardItem
		_ = rows.Scan(&item.TotalDays, &item.Username, &item.Position)

		leaderboard = append(leaderboard, item)
	}

	return leaderboard, nil
}
