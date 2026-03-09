package models

import (
	"time"
)

type Word struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Character    string    `gorm:"uniqueIndex;not null" json:"character"`
	Pinyin       string    `json:"pinyin"`
	Translation  string    `json:"translation"`
	Examples     string    `gorm:"type:text" json:"examples"`
	ImageURL     string    `json:"image_url"`
	StrokeOrder  string    `gorm:"type:text" json:"stroke_order"`
	LearnedCount int       `gorm:"default:0" json:"learned_count"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UserProgress struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       string    `gorm:"index" json:"user_id"`
	WordID       uint      `json:"word_id"`
	Word         Word      `gorm:"foreignKey:WordID" json:"word"`
	MasteryLevel int       `gorm:"default:0" json:"mastery_level"`
	LastReviewed time.Time `json:"last_reviewed"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type BaoBaoConversation struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    string    `gorm:"index" json:"user_id"`
	Message   string    `gorm:"type:text" json:"message"`
	Response  string    `gorm:"type:text" json:"response"`
	CreatedAt time.Time `json:"created_at"`
}
