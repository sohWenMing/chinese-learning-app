package services

import (
	"chinese-learning-app/backend/database"
	"chinese-learning-app/backend/models"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type ChatRequest struct {
	UserID  string `json:"user_id"`
	Message string `json:"message"`
}

type ChatResponse struct {
	Message  string `json:"message"`
	Level    int    `json:"level"`
	WordUsed string `json:"word_used,omitempty"`
}

func GetBaoBaoResponse(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var progress []models.UserProgress
	database.DB.Preload("Word").Where("user_id = ?", req.UserID).Find(&progress)

	totalWords := len(progress)
	level := calculateBaoBaoLevel(totalWords)

	response := generateBaoBaoMessage(level, progress)

	// Save conversation
	conversation := models.BaoBaoConversation{
		UserID:   req.UserID,
		Message:  req.Message,
		Response: response,
	}
	database.DB.Create(&conversation)

	c.JSON(http.StatusOK, ChatResponse{
		Message: response,
		Level:   level,
	})
}

func calculateBaoBaoLevel(wordCount int) int {
	if wordCount == 0 {
		return 1
	}
	if wordCount < 5 {
		return 2
	}
	if wordCount < 10 {
		return 3
	}
	if wordCount < 20 {
		return 4
	}
	if wordCount < 30 {
		return 5
	}
	return 6
}

func generateBaoBaoMessage(level int, progress []models.UserProgress) string {
	if len(progress) == 0 {
		return "Hi! I'm Bao Bao Panda! 🐼 Draw some Chinese characters for me and I'll help you learn them!"
	}

	learnedWords := getLearnedWords(progress)

	switch level {
	case 1:
		return "Great job! Keep learning more words!"
	case 2:
		if len(learnedWords) > 0 {
			return fmt.Sprintf("Wow! You learned %s! That's awesome!", learnedWords[0])
		}
		return "You're doing great!"
	case 3:
		if len(learnedWords) >= 2 {
			return fmt.Sprintf("Look at you! You know %s and %s! 太棒了!", learnedWords[0], learnedWords[1])
		}
		return "Keep going! You're learning so fast!"
	case 4:
		if len(learnedWords) >= 3 {
			return fmt.Sprintf("你好! You know %s, %s, %s... I'm so proud of you!", learnedWords[0], learnedWords[1], learnedWords[2])
		}
		return "你好! You're becoming a Chinese expert!"
	case 5:
		words := strings.Join(learnedWords[:min(len(learnedWords), 5)], ", ")
		return fmt.Sprintf("哇！You know %s! 你太厉害了!", words)
	default:
		words := strings.Join(learnedWords[:min(len(learnedWords), 5)], ", ")
		return fmt.Sprintf("你好朋友! You know so many words: %s! Let's talk in Chinese!", words)
	}
}

func getLearnedWords(progress []models.UserProgress) []string {
	words := make([]string, len(progress))
	for i, p := range progress {
		words[i] = p.Word.Character
	}
	return words
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
