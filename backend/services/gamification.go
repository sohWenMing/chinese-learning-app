package services

import (
	"chinese-learning-app/backend/database"
	"chinese-learning-app/backend/models"
	"time"
)

type GamificationService struct{}

func (g *GamificationService) GetStreak(userID string) int {
	var progress []models.UserProgress
	database.DB.Where("user_id = ?", userID).Find(&progress)

	if len(progress) == 0 {
		return 0
	}

	streak := 0
	now := time.Now()
	for _, p := range progress {
		if now.Sub(p.LastReviewed).Hours() < 48 {
			streak++
		}
	}

	return streak
}

func (g *GamificationService) GetBadges(userID string) []string {
	var progress []models.UserProgress
	database.DB.Where("user_id = ?", userID).Find(&progress)

	badges := []string{}

	if len(progress) >= 5 {
		badges = append(badges, "First Steps")
	}
	if len(progress) >= 20 {
		badges = append(badges, "Word Collector")
	}
	if len(progress) >= 50 {
		badges = append(badges, "Chinese Master")
	}

	masteredCount := 0
	for _, p := range progress {
		if p.MasteryLevel >= 5 {
			masteredCount++
		}
	}
	if masteredCount >= 10 {
		badges = append(badges, "Dedication")
	}

	return badges
}

func (g *GamificationService) GetXP(userID string) int {
	var progress []models.UserProgress
	database.DB.Where("user_id = ?", userID).Find(&progress)

	xp := 0
	for _, p := range progress {
		xp += p.MasteryLevel * 10
	}
	return xp
}
