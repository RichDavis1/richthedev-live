package core

import (
	"errors"
	"html/template"
	"io"

	"github.com/RichDavis1/richthedev-live/config"

	"github.com/labstack/echo"
)

var templateDir string

func init() {
	config := config.Config{}
	templateDir = config.TemplateDir()
}

type TemplateRenderer struct {
	templates map[string]*template.Template
}

func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	tmpl, ok := t.templates[name]

	if !ok {
		err := errors.New("Template not found -> " + name)
		return err
	}

	return tmpl.ExecuteTemplate(w, "base", data)
}

func CreateTemplates() *TemplateRenderer {
	templates := map[string]*template.Template{
		"home":            temp("home.html", "base.html"),
		"problems":        temp("problems.html", "base.html"),
		"problem":         temp("problem.html", "base.html"),
		"projects":        temp("projects.html", "base.html"),
		"quick-portfolio": temp("projects/quick-portfolio.html", "base.html"),
		"php-w2v":         temp("projects/php-w2v.html", "base.html"),
		"him":             temp("projects/him.html", "base.html"),
	}

	t := &TemplateRenderer{
		templates: templates,
	}

	return t
}

func temp(page string, layout string) *template.Template {
	var template = template.Must(template.New("main").Funcs(template.FuncMap{
		"noescape": noescape,
		"safeHtml": safeHtml,
	}).ParseFiles(templateDir+"pages/"+page, templateDir+"layouts/"+layout))

	return template
}

func noescape(str string) template.HTML {
	return template.HTML(str)
}

func safeHtml(html template.HTML) template.HTML {
	return template.HTML(html)
}
