package database

import (
	"github.com/fatih/color"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"os"
)

var (
	// assigned in line 26
	Conn *gorm.DB
)

type BookSchema struct {
	gorm.Model
	Title string `json:"title"`
	ID    uint   `json:"id"`
}

func Init() {
	// Connect database
	db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})

	// Go Database Connectivity API: init GDBC
	Conn = db

	if err != nil {
		panic("failed to connect")
	}

	// Migrate the schema
	ErrDBNotConnected := db.AutoMigrate(&BookSchema{})

	if ErrDBNotConnected != nil {
		os.Exit(1)
		color.Red("DB connect failed")
	} else {
		color.Green("Schema migrated")
	}

	color.Green("DB connected")
}
