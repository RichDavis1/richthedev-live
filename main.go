package main

import (
	"github.com/RichDavis1/richthedev-live/cmd/controller"
	"github.com/RichDavis1/richthedev-live/cmd/core"

	"github.com/RichDavis1/richthedev-live/config"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo"
)

func main() {
	config := config.Config{}

	e := echo.New()

	e.Static("/assets", config.AssetsDir())
	e.Renderer = core.CreateTemplates()

	e.GET("/", controller.Home{}.Show)
	e.GET("/problems*", controller.ProblemsController{}.List)
	e.GET("/problem/:slug", controller.ProblemsController{}.Show).Name = "slug"
	e.GET("/contact/create", controller.ContactsController{}.Create)
	e.POST("/contact/store", controller.ContactsController{}.Store)
	e.GET("/projects*", controller.ProjectsController{}.List)
	e.GET("/project/:slug", controller.ProjectsController{}.Show).Name = "slug"

	e.Debug = true
	e.Logger.Fatal(e.Start(config.Port()))
}
