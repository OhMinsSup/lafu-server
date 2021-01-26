package mains

import (
	"github.com/labstack/echo/v4"
	"lafu-server/controller"
)



func ApplyCarouselRoutes(e *echo.Group) {
	carousel := e.Group("/carousel")

	carousel.GET("/list", controller.CarouselListController)
}
