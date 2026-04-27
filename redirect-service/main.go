package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type SyncRequest struct {
	ShortCode   string `json:"shortCode" binding:"required"`
	OriginalUrl string `json:"originalUrl" binding:"required"`
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	initDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "4002"
	}

	r := gin.Default()

	// 1. DATA REPLICATION
	r.POST("/internal/sync", func(c *gin.Context) {
		var req SyncRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// ORM Sync: Create or Update
		urlObj := URL{ShortCode: req.ShortCode, OriginalUrl: req.OriginalUrl}
		result := GORM_DB.Save(&urlObj)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Sync failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "Synced successfully"})
	})

	// 2. REDIRECT
	r.GET("/:code", func(c *gin.Context) {
		code := c.Param("code")

		var urlObj URL
		// ORM: Find First
		result := GORM_DB.First(&urlObj, "short_code = ?", code)
		if result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
			return
		}

		// Notify Analytics asynchronously
		go func(sc string) {
			analyticsUrl := "http://localhost:4003/visit"
			payload, _ := json.Marshal(map[string]string{"shortCode": sc})
			resp, err := http.Post(analyticsUrl, "application/json", bytes.NewBuffer(payload))
			if err == nil {
				resp.Body.Close()
			}
		}(code)

		c.Redirect(http.StatusFound, urlObj.OriginalUrl)
	})

	log.Printf("🚀 Redirect Service (GORM) running on port %s", port)
	r.Run(":" + port)
}
