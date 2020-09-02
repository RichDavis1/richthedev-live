package controller

import (
	"net/http"
	"sync"

	"github.com/RichDavis1/richthedev-live/cmd/models"

	"github.com/labstack/echo"
)

type ProjectsController struct {
}

func (p ProjectsController) List(c echo.Context) error {
	var projects []models.Project

	models.DB.Find(&projects)

	wg := sync.WaitGroup{}
	wg.Add(len(projects))

	for i, _ := range projects {
		go func(nextI int) {
			projects[nextI].RandomColor()
			projects[nextI].SelectedCategories()

			wg.Done()
		}(i)
	}
	wg.Wait()

	response := struct {
		Projects []models.Project
	}{
		projects,
	}

	return c.Render(http.StatusOK, "projects", response)
}

func (p ProjectsController) Show(c echo.Context) error {
	var project models.Project

	models.DB.Where("slug = ?", c.Param("slug")).First(&project)

	project.SetCategoryColors()

	slug := project.Slug

	response := struct {
		models.Project
	}{
		project,
	}

	return c.Render(http.StatusOK, slug, response)
}
