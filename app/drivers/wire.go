//go:build wireinject
// +build wireinject

package drivers

import (
	"context"

	"github.com/Hacknock/leadyou/adapters/controllers"
	"github.com/google/wire"
	"github.com/labstack/echo/v4"
)

func InitializeLeadyouDriver(ctx context.Context) (Leadyou, error) {
	wire.Build(echo.New, controllers.NewWebController, NewWebDriver)
	return &WebDriver{}, nil
}
