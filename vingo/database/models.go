package database

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	Id        int            `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"-"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

type User struct {
	BaseModel
	Username   string `json:"username"`
	Admin      bool   `json:"admin"`
	SettingsId int
	Settings   Settings `json:"settings"`
	Cards      []Card   `json:"-" gorm:"foreignKey:UserId;references:Id"`
}

type Settings struct {
	BaseModel
	ScanInOut   bool `json:"scan_in_out"`
	Leaderboard bool `json:"leaderboard"`
	Public      bool `json:"public"`
}

type Card struct {
	BaseModel
	Serial string `gorm:"uniqueIndex"`
	Name   string
	UserId int
	User   User
	Scans  []Scan `gorm:"foreignKey:CardSerial;references:Serial"`
}

func Card_to_API(card Card) CardAPI {
	var lastUsed time.Time = card.CreatedAt
	if len(card.Scans) != 0 {
		lastUsed = card.Scans[len(card.Scans)-1].ScanTime
	}

	return CardAPI{
		Id:         card.Id,
		Serial:     card.Serial,
		Name:       card.Name,
		LastUsed:   lastUsed,
		AmountUsed: len(card.Scans),
	}
}

type CardAPI struct {
	Id         int       `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	Serial     string    `json:"serial"`
	Name       string    `json:"name"`
	LastUsed   time.Time `json:"last_used"`
	AmountUsed int       `json:"amount_used"`
}

type Scan struct {
	BaseModel
	ScanTime   time.Time `json:"scan_time"`
	CardSerial string    `json:"card_serial" gorm:"index"`
	Card       Card      `json:"-" gorm:"foreignKey:CardSerial;references:Serial"`
}

type Season struct {
	BaseModel
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type StreakDay struct {
	BaseModel
	Date time.Time `json:"date"`
}
