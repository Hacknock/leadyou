package controllers

import (
	"context"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Leadyou interface {
	IndexPage(ctx context.Context) func(c echo.Context) error
}

type WebController struct {
}

func NewWebController() Leadyou {
	return &WebController{}
}

func (w *WebController) IndexPage(ctx context.Context) func(c echo.Context) error {
	return func(c echo.Context) error {
		return c.String(http.StatusOK, "OKだよ")
	}
}
