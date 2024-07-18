package database

func (Season) GetAll() ([]Season, error) {
	var seasons []Season
	result := gorm_db.Find(&seasons)
	return seasons, result.Error
}

func (s Season) Create() error {
	return gorm_db.Create(s).Error
}
