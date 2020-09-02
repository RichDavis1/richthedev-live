package controller

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/RichDavis1/richthedev-live/cmd/core"
	"github.com/RichDavis1/richthedev-live/cmd/models"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo"
)

type ContactsController struct {
}

func (cc ContactsController) Create(c echo.Context) error {
	content, err := ioutil.ReadFile(webP + "/templates/modals/ContactModal.html")

	if err != nil {
		log.Fatal(err)
	}

	emp := make(map[string]interface{})
	emp["status"] = "success"
	emp["modal"] = string(content)

	return c.JSON(http.StatusOK, emp)
}

func (cc ContactsController) Store(c echo.Context) error {
	validate := validator.New()
	validate.RegisterValidation("SanString", core.SanString)

	contact := new(models.Contact)

	if err := c.Bind(contact); err != nil {
		c.Logger().Error(err)

		return err
	}

	if err := validate.Struct(contact); err != nil {
		c.Logger().Error(err)
		response := core.DataError(err.(validator.ValidationErrors))

		return c.JSON(http.StatusOK, response)
	}

	models.DB.Save(&contact)

	return c.JSON(http.StatusOK, contact)
}
