package mains

import (
	"github.com/labstack/echo/v4"
	"lafu-server/controller"
)

func ApplyRecommendRoute(e *echo.Group) {
	recommend := e.Group("/recommend")

	recommend.GET("/list", controller.RecommendListController)
}
