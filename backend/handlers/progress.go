package handlers

import (
	"chinese-learning-app/database"
	"chinese-learning-app/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type LearnWordRequest struct {
	UserID      string `json:"user_id"`
	Character   string `json:"character"`
	Pinyin      string `json:"pinyin"`
	Translation string `json:"translation"`
}

func MarkWordLearned(c *gin.Context) {
	var req LearnWordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Find or create the word
	var word models.Word
	result := database.DB.Where("character = ?", req.Character).First(&word)

	if result.Error != nil {
		word = models.Word{
			Character:   req.Character,
			Pinyin:      req.Pinyin,
			Translation: req.Translation,
		}
		database.DB.Create(&word)
	}

	// Update learned count
	word.LearnedCount++
	database.DB.Save(&word)

	// Create or update user progress
	var progress models.UserProgress
	database.DB.Where("user_id = ? AND word_id = ?", req.UserID, word.ID).First(&progress)

	if progress.ID == 0 {
		progress = models.UserProgress{
			UserID:       req.UserID,
			WordID:       word.ID,
			MasteryLevel: 1,
			LastReviewed: time.Now(),
		}
		database.DB.Create(&progress)
	} else {
		progress.MasteryLevel++
		progress.LastReviewed = time.Now()
		database.DB.Save(&progress)
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Word learned!",
		"word":          word,
		"mastery_level": progress.MasteryLevel,
	})
}

func GetProgress(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		userID = "default"
	}

	var progress []models.UserProgress
	database.DB.Preload("Word").Where("user_id = ?", userID).Find(&progress)

	totalWords := len(progress)
	masteredWords := 0
	for _, p := range progress {
		if p.MasteryLevel >= 5 {
			masteredWords++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id":        userID,
		"total_words":    totalWords,
		"mastered_words": masteredWords,
		"words":          progress,
	})
}
