package models

import (
	_ "github.com/go-sql-driver/mysql"
)

type Contact struct {
	Id      int    `gorm:"primary_key"`
	Name    string `db:"name" json:"name,string,omitempty" validate:"min=3,max=40,required"`
	Email   string `db:"email" json:"email,string,omitempty" validate:"required,email"`
	Subject string `db:"subject" json:"subject,string,omitempty" validate:"SanString"`
	Message string `db:"message" json:"message,string,omitempty" validate:"SanString"`
}
