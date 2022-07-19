package repository

import (
	"Hacknock/database"
	"fmt"
	"os"
)

type GetRepoData struct {
}

func (g GetRepoData) GetCount() (int, error) {
	mdb := database.MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}
	db, err := mdb.Init()
	if db == nil || err != nil {
		fmt.Printf("🚨 %s\n", err)
	}

	return 3, nil
}
