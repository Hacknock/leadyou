package repository

import (
	"Hacknock/database"
	"os"
	"testing"
)

func TestMain(m *testing.M) {
	sqdb := database.Database{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
	}
	err := sqdb.Init()
	if err != nil {
		return
	}

	code := m.Run()

	os.Exit(code)
}
func TestGetCount(t *testing.T) {
	getRD := GetRepoData{}
	num, err := getRD.GetCount()

	if err != nil || num != 3 {
		t.Fatal(err)
	}
}
