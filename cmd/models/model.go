package models

import (
	"log"

	"github.com/RichDavis1/richthedev-live/config"

	"github.com/jinzhu/gorm"
)

var DbUser string
var DB *gorm.DB
var err error

func init() {
	config := config.Config{}
	DB, err = gorm.Open(config.DbDialect(), config.DbString())

	if err != nil {
		log.Fatal(err)
	}
}

type Model interface {
}
