package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type StrokeData struct {
	Character string   `json:"character"`
	SVG       string   `json:"svg"`
	Strokes   []string `json:"strokes"`
}

func GetStrokeOrder(c *gin.Context) {
	character := c.Param("character")

	if character == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Character required"})
		return
	}

	strokeData, err := fetchStrokeOrder(character)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"character": character,
			"svg":       "",
			"strokes":   []string{},
			"found":     false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"character": character,
		"svg":       strokeData.SVG,
		"strokes":   strokeData.Strokes,
		"found":     true,
	})
}

func fetchStrokeOrder(character string) (*StrokeData, error) {
	url := fmt.Sprintf("https://api.makemeahanzi.com/character/%s", character)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("character not found")
	}

	var data StrokeData
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	return &data, nil
}
