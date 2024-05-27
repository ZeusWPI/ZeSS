package database

import "time"

type Day struct {
	Id   int
	Date time.Time
}

var (
	daysCreateStmt = `
		CREATE TABLE IF NOT EXISTS days (
			id SERIAL NOT NULL PRIMARY KEY,
			date DATE NOT NULL UNIQUE
		);
		`
)

func CreateDay(day time.Time) error {
	_, err := db.Exec("INSERT INTO days (date) VALUES ($1);", day)
	if err != nil {
		return err
	}

	return nil
}

func CreateDays(first_day time.Time, last_day time.Time) error {
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	defer tx.Rollback()

	for d := first_day; !d.After(last_day); d = d.AddDate(0, 0, 1) {
		// Ignore weekends
		if d.Weekday() == time.Saturday || d.Weekday() == time.Sunday {
			continue
		}

		_, err := db.Exec("INSERT INTO days (date) VALUES ($1);", d)
		if err != nil {
			return err
		}
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func GetDays() ([]Day, error) {
	rows, err := db.Query("SELECT id, date FROM days ORDER BY date;")
	if err != nil {
		return nil, err
	}

	days := make([]Day, 0)
	for rows.Next() {
		var day Day
		rows.Scan(&day.Id, &day.Date)
		days = append(days, day)
	}

	return days, nil
}

func DeleteDay(dayId string) error {
	_, err := db.Exec("DELETE FROM days WHERE id = $1;", dayId)
	if err != nil {
		return err
	}

	return nil
}
