package controller

import (
	"github.com/labstack/echo/v4"
	"lafu-server/lib"
	"lafu-server/model"
	"net/http"
)

func CarouselListController(ctx echo.Context) error {
	carousels := []model.Carousel{
		model.Carousel{
			ID:         76,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_BangDream3rd_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_mobile_BangDream3rd_w.jpg",
			LogoImg:    "https://image.laftel.net/carousel/%EB%B1%85%EB%93%9C%EB%A6%BC_%EB%9D%BC%ED%94%84%ED%85%94_1228x515_v2.png",
			Content:    "뱅드림! 걸파 3주년 사전예약",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         33,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_MDZS_Q_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_MDZS_Q_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_MDZS_Q.png",
			Content:    "귀요미들을 보니 여기가 바로 무릉도원이구나",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         29,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_WanganMidnight_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_WanganMidnight_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_WanganMidnight.png",
			Content:    "사람들을 홀리는 악마의 Z",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         56,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_horimiya_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_horimiya_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_horimiya.png",
			Content:    "반전매력×반전매력 로맨스",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         75,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_jujutsuPART2_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_jujutsuPART2_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_jujutsuPART2.png",
			Content:    "요즘에 주술회전 안 보는 사람 있어?",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         71,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_21jan_end_w.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_21jan_end_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_21jan_end.png",
			Content:    "레전드 에피를 평생 소장할 수 있는 마지막 기회!",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
		model.Carousel{
			ID:         66,
			WebImg:     "https://image.laftel.net/carousel/carousel_hero_kimetsu_w_edit.jpg",
			MobileImg:  "https://image.laftel.net/carousel/carousel_hero_kimetsu_m.jpg",
			LogoImg:    "https://image.laftel.net/carousel/carousel_logo_kimetsu.png",
			Content:    "극장판 보기 전에 TVA 완벽 복습하기!",
			Label:      "",
			ButtonText: "보러가기",
			IsAdult:    false,
		},
	}

	return ctx.JSON(http.StatusOK, lib.JSON{
		"resultCode": 0,
		"message":    "",
		"data":       carousels,
	})
}
