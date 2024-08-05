package database

import (
	"time"

	"gorm.io/gorm"
)

func CreateDays(first_day time.Time, last_day time.Time) error {
	err := gorm_db.Transaction(func(tx *gorm.DB) error {
		for d := first_day; !d.After(last_day); d = d.AddDate(0, 0, 1) {
			// Ignore weekends
			if d.Weekday() == time.Saturday || d.Weekday() == time.Sunday {
				continue
			}

			if err := tx.Create(&StreakDay{Date: d}).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func GetDays() ([]StreakDay, error) {
	var days []StreakDay
	err := gorm_db.Find(&days).Error

	return days, err
}

func DeleteDay(dayId string) error {
	_, err := db.Exec("DELETE FROM streak_days WHERE id = $1;", dayId)
	if err != nil {
		return err
	}

	return nil
}
