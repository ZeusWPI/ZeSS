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
