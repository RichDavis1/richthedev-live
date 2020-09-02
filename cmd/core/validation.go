package core

import (
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

type ValidationError struct {
	Field string
	Error string
}

func SanString(fl validator.FieldLevel) bool {
	re := regexp.MustCompile("^([a-zA-Z0-9' -?])*$")
	pass := re.MatchString(fl.Field().String())

	return pass
}

func DataError(ve validator.ValidationErrors) map[string]interface{} {
	var dataErrors []ValidationError

	for _, validationError := range ve {
		field := strings.ToLower(validationError.Field())
		NewError := ValidationError{Field: field, Error: "Invalid value"}
		dataErrors = append(dataErrors, NewError)
	}

	response := make(map[string]interface{})
	response["status"] = "failed"
	response["errors"] = dataErrors

	return response
}
