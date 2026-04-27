package main

import (
	"log"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var GORM_DB *gorm.DB

// URL Model for GORM
type URL struct {
	ShortCode   string `gorm:"primaryKey"`
	OriginalUrl string `gorm:"not null"`
}

func initDB() {
	var err error
	// Pure Go sqlite driver: glebarez/sqlite
	GORM_DB, err = gorm.Open(sqlite.Open("redirect.sqlite"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to SQLite via GORM:", err)
	}

	// Auto-migrate tables
	err = GORM_DB.AutoMigrate(&URL{})
	if err != nil {
		log.Fatal("GORM Migration failed:", err)
	}
	log.Println("GORM: SQLite Database initialized and migrated successfully")
}
