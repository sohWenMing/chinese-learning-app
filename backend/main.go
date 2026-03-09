package main

import (
	"chinese-learning-app/database"
	"chinese-learning-app/handlers"
	"chinese-learning-app/services"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	database.Connect()
	database.Migrate()

	r := gin.Default()

	r.Static("/assets", "./dist/assets")
	r.StaticFile("/", "./dist/index.html")

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api")
	{
		api.POST("/handwriting", handlers.RecognizeHandwriting)
		api.GET("/dictionary/:character", handlers.GetDictionary)
		api.GET("/strokes/:character", handlers.GetStrokeOrder)
		api.GET("/image/:word", handlers.GetAIImage)
		api.POST("/progress/learn", handlers.MarkWordLearned)
		api.GET("/progress", handlers.GetProgress)
		api.POST("/bao-bao/chat", services.GetBaoBaoResponse)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
