package config

import (
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

func init() {
	godotenv.Load("./local.env")
}

type Config struct {
	DbUser string
	DbName string
	DbPass string
	DbTcp  string
}

func (c *Config) DbDialect() string {
	return os.Getenv("DIALECT")
}

func (c *Config) TemplateDir() string {
	return os.Getenv("WEB") + "templates/"
}

func (c *Config) DbString() string {
	DbUser := os.Getenv("DB_USER")
	DbPw := os.Getenv("DB_PW")
	DbName := os.Getenv("DB")
	Endpoint := os.Getenv("ENDPOINT")

	return DbUser + ":" + DbPw + "@tcp(" + Endpoint + ":3306)/" + DbName + "?charset=utf8&parseTime=True"
}

func (c *Config) AssetsDir() string {
	return os.Getenv("WEB") + "/assets/public"
}

func (c *Config) WebP() string {
	web := os.Getenv("WEB")
	absWeb, _ := filepath.Abs(web)

	return absWeb
}

func (c *Config) Port() string {
	return os.Getenv("PORT")
}
