package handlers

import (
	"fmt"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

func GetAIImage(c *gin.Context) {
	word := c.Param("word")

	if word == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Word required"})
		return
	}

	// Use Pollinations.ai for AI-generated images
	// Format: https://image.pollinations.ai/prompt/{prompt}
	prompt := fmt.Sprintf("simple cute illustration of %s, cartoon style, child-friendly, white background", url.QueryEscape(word))
	imageURL := fmt.Sprintf("https://image.pollinations.ai/prompt/%s", url.QueryEscape(prompt))

	c.JSON(http.StatusOK, gin.H{
		"word":      word,
		"image_url": imageURL,
		"prompt":    prompt,
	})
}
