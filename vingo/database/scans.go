package database

import "time"

type Scan struct {
	ScanTime time.Time
	Card     string
}

type Present struct {
	Date      time.Time
	Present   bool
	StreakDay bool
}

var (
	scansCreateStmt = `
		CREATE TABLE IF NOT EXISTS scans (
			id SERIAL NOT NULL PRIMARY KEY,
			scan_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
			scan_type BOOLEAN,
			card_serial TEXT NOT NULL REFERENCES cards(serial)
		);
	`
)

func GetScansForUser(user_id int) ([]Scan, error) {
	scans_rows, err := db.Query("SELECT scan_time, card_serial FROM scans WHERE card_serial IN (SELECT serial FROM cards WHERE user_id = $1);", user_id)
	if err != nil {
		return nil, err
	}

	var scans []Scan

	for scans_rows.Next() {
		var scan Scan
		_ = scans_rows.Scan(&scan.ScanTime, &scan.Card)

		scans = append(scans, scan)
	}
	return scans, nil
}

func CreateScan(card_serial string) error {
	_, err := db.Exec("INSERT INTO scans (card_serial) VALUES ($1);", card_serial)
	return err
}

func GetPresenceHistory(user_id int) ([]Present, error) {
	rows, err := db.Query(`
		WITH date_series AS (
			SELECT generate_series(CURRENT_DATE AT TIME ZONE 'Europe/Brussels' - INTERVAL '6 days', CURRENT_DATE, '1 day')::date AS date
		)
		SELECT 
			ds.date,
			CASE WHEN scans.scan_date IS NOT NULL THEN TRUE ELSE FALSE END AS present,
			CASE WHEN days.date IS NOT NULL THEN TRUE ELSE FALSE END AS streak_day
		FROM date_series ds
		LEFT JOIN (
			SELECT DISTINCT (scan_time AT TIME ZONE 'Europe/Brussels')::date AS scan_date
			FROM scans
			LEFT JOIN cards
			ON card_serial = serial
			WHERE user_id = $1
		) scans
		ON ds.date = scans.scan_date
		LEFT JOIN days
		ON ds.date = days.date
		ORDER BY ds.date;
	`, user_id)
	if err != nil {
		return nil, err
	}

	var presences []Present
	for rows.Next() {
		var present Present
		_ = rows.Scan(&present.Date, &present.Present, &present.StreakDay)

		presences = append(presences, present)
	}

	return presences, nil
}
