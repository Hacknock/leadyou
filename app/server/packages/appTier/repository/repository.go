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
		Test:     true,
	}
	db, err := sqdb.Init()
	if db == nil || err != nil {
		fmt.Printf("🚨 %s\n", err)
	}

	return 3, nil
}
