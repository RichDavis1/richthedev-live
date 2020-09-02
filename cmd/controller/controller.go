package controller

import "github.com/RichDavis1/richthedev-live/config"

type Controller interface {
}

var webP string

func init() {
	config := config.Config{}
	webP = config.WebP()
}
