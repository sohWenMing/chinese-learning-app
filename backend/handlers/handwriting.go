package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HandwritingRequest struct {
	DrawingData string `json:"drawing_data"`
}

type HandwritingResponse struct {
	Characters []string `json:"characters"`
}

func RecognizeHandwriting(c *gin.Context) {
	var req HandwritingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	character := req.DrawingData

	c.JSON(http.StatusOK, gin.H{
		"characters": []string{character},
	})
}
