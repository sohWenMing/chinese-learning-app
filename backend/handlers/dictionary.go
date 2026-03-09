package handlers

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type DictionaryEntry struct {
	Character   string   `json:"character"`
	Pinyin      string   `json:"pinyin"`
	Translation string   `json:"translation"`
	Examples    []string `json:"examples"`
}

func GetDictionary(c *gin.Context) {
	character := c.Param("character")
	character = strings.TrimSpace(character)

	if character == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Character required"})
		return
	}

	entry, err := lookupCEDICT(character)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"character":   character,
			"pinyin":      "Not found",
			"translation": "We couldn't find this word. Try drawing it again!",
			"examples":    []string{},
			"found":       false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"character":   entry.Character,
		"pinyin":      entry.Pinyin,
		"translation": entry.Translation,
		"examples":    entry.Examples,
		"found":       true,
	})
}

func lookupCEDICT(character string) (*DictionaryEntry, error) {
	resp, err := http.Get("https://raw.githubusercontent.com/sergioburzi/cedict/master/cedict_ts.u8")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	lines := strings.Split(string(body), "\n")
	for _, line := range lines {
		if strings.HasPrefix(line, character+" ") {
			return parseCEDICTLine(line, character)
		}
	}

	return nil, fmt.Errorf("not found")
}

func parseCEDICTLine(line, character string) (*DictionaryEntry, error) {
	entry := &DictionaryEntry{
		Character: character,
	}

	start := strings.Index(line, "]")
	end := strings.Index(line, "/")
	if start != -1 && end != -1 && end > start {
		entry.Pinyin = strings.TrimSpace(line[start+1 : end])
	}

	if end != -1 {
		definitions := strings.Split(line[end+1:], "/")
		if len(definitions) > 0 {
			entry.Translation = definitions[0]
		}
	}

	return entry, nil
}
