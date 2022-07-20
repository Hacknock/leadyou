package repository

import (
	"Hacknock/database"
	"fmt"
	"os"
)

type GetRepoData struct {
}

func (g GetRepoData) GetCount() (int, error) {
	sqdb := database.Database{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
	}
	db, err := sqdb.Open()
	if db == nil || err != nil {
		fmt.Printf("🚨 %s\n", err)
	}

	return 3, nil
}
