package database

import (
	"time"

	"gorm.io/gorm"
)

type BaseModel struct {
	Id        int            `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
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
	ScanInOut   bool `json:"scanInOut"`
	Leaderboard bool `json:"leaderboard"`
	Public      bool `json:"public"`
}

type Card struct {
	BaseModel
	Serial string `json:"serial" gorm:"uniqueIndex"`
	Name   string `json:"name"`
	UserId int    `json:"-"`
	User   User   `json:"-"`
	Scans  []Scan `json:"-" gorm:"foreignKey:CardSerial;references:Serial"`
}

type Scan struct {
	BaseModel
	ScanTime   time.Time `json:"scanTime"`
	CardSerial string    `json:"cardSerial" gorm:"index"`
	Card       Card      `json:"-" gorm:"foreignKey:CardSerial;references:Serial"`
}
