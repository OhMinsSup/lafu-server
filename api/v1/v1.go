package v1

import (
	"github.com/labstack/echo/v4"
	carousel "lafu-server/api/v1/mains"
)

func ApplyRoutes(e *echo.Group) {
	v1 := e.Group("/v1.0")

	carousel.ApplyRoutes(v1)
}
