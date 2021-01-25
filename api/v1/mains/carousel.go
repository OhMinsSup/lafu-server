package carousel

import (
	"github.com/labstack/echo/v4"
	"lafu-server/controller"
)



func ApplyRoutes(e *echo.Group) {
	carousel := e.Group("/carousel")

	carousel.GET("/list", controller.CarouselListController)
}
