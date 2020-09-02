package controller

import (
	"net/http"

	"github.com/labstack/echo"
)

type Home struct {
}

func (h Home) Show(c echo.Context) error {
	return c.Render(http.StatusOK, "home", nil)
}

var _ Controller = (*Home)(nil)
