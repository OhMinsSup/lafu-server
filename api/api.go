package api

import (
	"github.com/labstack/echo/v4"
	v1 "lafu-server/api/v1"
)

func ApplyRoutes(e *echo.Echo)  {
	api := e.Group("/api")
	v1.ApplyRoutes(api)
}
