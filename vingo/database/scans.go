package database

type Scan struct {
	ScanTime string
	Card     string
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

func CreateScan(card string) error {
	_, err := db.Exec("INSERT INTO scans (card_serial) VALUES ($1);", card)
	return err
}
