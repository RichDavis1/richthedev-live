package models

import (
	"html/template"
	"math/rand"

	_ "github.com/go-sql-driver/mysql"
	strip "github.com/grokify/html-strip-tags-go"
)

type Problem struct {
	Id              int           `gorm:"primary_key"`
	Title           string        `db:"title" json:"title,string,omitempty"`
	Slug            string        `db:"slug"`
	Status          string        `db:"status" json:"status,string,omitempty"`
	Content         string        `db:"content" json:"content,string,omitempty"`
	Preview         string        `gorm:"-"`
	ReadTime        string        `db:"read_time"`
	GithubLink      string        `db:"github_link"`
	Cats            []Category    `gorm:"-" sql:"-"`
	TextColor       template.HTML `gorm:"-" json:"textcolor,string,omitempty"`
	BackgroundColor template.HTML `gorm:"-"`
}

func (p Problem) Colors() []map[string]template.HTML {
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

func (p *Problem) RandomColor() {
	colors := p.Colors()
	randomKey := rand.Intn(len(colors))

	p.TextColor = colors[randomKey]["text"]
	p.BackgroundColor = colors[randomKey]["background"]
}

func (p *Problem) SetPreview() {
	if len(p.Content) > 0 {
		p.Preview = strip.StripTags(p.Content)[0:300]
	}
}

func (p *Problem) SelectedCategories() {
	var categories []Category

	DB.Raw("SELECT * FROM categories LEFT JOIN category_assignment on categories.id=category_assignment.category_id WHERE category_assignment.post_id = ? AND category_assignment.table = ?", p.Id, "problems").Scan(&categories)

	p.Cats = categories
}

func (p *Problem) SetCategoryColors() {
	var categories []Category

	DB.Raw("SELECT * FROM categories LEFT JOIN category_assignment on categories.id=category_assignment.category_id WHERE category_assignment.post_id = ? AND category_assignment.table = ?", p.Id, "problems").Scan(&categories)

	for i, _ := range categories {
		categories[i].SetColors()
	}

	p.Cats = categories
}
