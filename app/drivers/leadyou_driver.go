package drivers

import (
	"context"

	"github.com/Hacknock/leadyou/adapters/controllers"
	"github.com/labstack/echo/v4"
)

type Leadyou interface {
	ServePages(ctx context.Context, portNumber string)
}

type WebDriver struct {
	echo       *echo.Echo
	controller controllers.Leadyou
}

func NewWebDriver(echo *echo.Echo, controller controllers.Leadyou) Leadyou {
	return &WebDriver{
		echo:       echo,
		controller: controller,
	}
}

func (driver *WebDriver) ServePages(ctx context.Context, portNumber string) {
	driver.echo.GET("/", driver.controller.IndexPage(ctx))

	driver.echo.File("/test", "./drivers/ui/html/index.html")

	driver.echo.Logger.Fatal(driver.echo.Start(portNumber))
}
