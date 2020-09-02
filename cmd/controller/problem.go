package controller

import (
	"net/http"
	"sync"

	"github.com/RichDavis1/richthedev-live/cmd/models"

	"github.com/labstack/echo"
)

type ProblemsController struct {
}

func (p ProblemsController) List(c echo.Context) error {
	var problems []models.Problem

	models.DB.Find(&problems)

	wg := sync.WaitGroup{}
	wg.Add(len(problems))

	for i, _ := range problems {
		go func(nextI int) {
			problems[nextI].RandomColor()
			problems[nextI].SelectedCategories()
			problems[nextI].SetPreview()

			wg.Done()
		}(i)
	}
	wg.Wait()

	response := struct {
		Problems []models.Problem
	}{
		problems,
	}

	return c.Render(http.StatusOK, "problems", response)
}

func (p ProblemsController) Show(c echo.Context) error {
	var problem models.Problem

	models.DB.Where("slug = ?", c.Param("slug")).First(&problem)

	problem.SetCategoryColors()

	response := struct {
		models.Problem
	}{
		problem,
	}

	return c.Render(http.StatusOK, "problem", response)
}

var _ Controller = (*ProblemsController)(nil)
