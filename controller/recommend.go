package controller

import (
	"github.com/labstack/echo/v4"
	"lafu-server/lib"
	"net/http"
)

func RecommendListController(ctx echo.Context) error {
	type Recommend struct {
		ID       string `json:"id"`
		Type     string `json:"type"`
		Name     string `json:"name"`
		ItemList []struct {
			ID     int    `json:"id"`
			Name   string `json:"name"`
			Images []struct {
				OptionName string `json:"option_name"`
				ImgURL     string `json:"img_url"`
				CropRatio  string `json:"crop_ratio"`
			} `json:"images"`
			IsAdult       bool     `json:"is_adult"`
			IsUncensored  bool     `json:"is_uncensored"`
			IsDubbed      bool     `json:"is_dubbed"`
			Medium        string   `json:"medium"`
			IsLaftelOnly  bool     `json:"is_laftel_only"`
			ContentRating string   `json:"content_rating"`
			IsEnding      bool     `json:"is_ending"`
			Genre         []string `json:"genre"`
			Content       string   `json:"content"`
			AvgRating     float64  `json:"avg_rating"`
			IsAvod        bool     `json:"is_avod"`
		} `json:"item_list"`
	}

	listType := ctx.QueryParam("listType")

	return ctx.JSON(http.StatusOK, lib.JSON{
		listType: listType,
	})
}
