package model

import "encoding/json"

type Carousel struct {
	ID                  int64       `json:"id"`
	WebImg              string      `json:"web_img"`
	MobileImg           string      `json:"mobile_img"`
	LogoImg             string      `json:"logo_img"`
	Content             string      `json:"content"`
	Label               string      `json:"label"`
	ButtonText          string      `json:"button_text"`
	IsAdult             bool        `json:"is_adult"`
}

func UnmarshalCarousel(data []byte) (Carousel, error) {
	var r Carousel
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *Carousel) Marshal() ([]byte, error) {
	return json.Marshal(r)
}
