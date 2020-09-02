package models

import (
	"html/template"
	"math/rand"
)

type Category struct {
	Id    int    `db:"id" json:"id,int" gorm:"unique"`
	Slug  string `db:"slug" json:"slug,string,omitempty"`
	Label string `db:"label"`

	TextColor       template.HTML `gorm:"-" json:"textcolor,string,omitempty"`
	BackgroundColor template.HTML `gorm:"-"`
}

func (c Category) Colors() []map[string]template.HTML {
	colors := []map[string]template.HTML{
		{
			"background": "#0ded97",
			"text":       "#252c34",
		},
		{
			"background": "#1458eb",
			"text":       "#ededed",
		},
		{
			"background": "#cb1a36",
			"text":       "#ededed",
		},
		{
			"background": "#f6774c",
			"text":       "#252c34",
		},
		{
			"background": "#19b2fe",
			"text":       "#252c34",
		},
		{
			"background": "#c4166d",
			"text":       "#ededed",
		},
		{
			"background": "#febf10",
			"text":       "#252c34",
		},
	}

	return colors
}

func (c *Category) SetColors() {
	colors := c.Colors()
	randomKey := rand.Intn(len(colors))

	c.TextColor = colors[randomKey]["text"]
	c.BackgroundColor = colors[randomKey]["background"]
}

//var _ Model = (*Category)(nil)
