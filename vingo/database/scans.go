package database

type Scan struct {
	ScanTime string
	Card     string
}

var (
	scansCreateStmt = `
		CREATE TABLE IF NOT EXISTS scans (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			scan_time TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
			card TEXT NOT NULL,
			FOREIGN KEY(card) REFERENCES cards(serial)
		);
	`
)

func GetScansForUser(user_id int) ([]Scan, error) {
	scans_rows, err := db.Query("SELECT scan_time, card FROM scans WHERE card IN (SELECT serial FROM cards WHERE user == ?);", user_id)
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

func CreateScan(card string) error {
	_, err := db.Exec("INSERT INTO scans (card) VALUES (?);", card)
	return err
}
