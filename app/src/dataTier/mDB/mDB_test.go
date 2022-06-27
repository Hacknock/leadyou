package mDB

import (
	"os"
	"testing"
)

func TestGet(t *testing.T) {
	// Make a handle
	mdb := MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	db, err := mdb.Open()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	// Get repository info
	param := WhereParams{Owner: "Hacknock", Repo: "test"}
	info, err := mdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "main" {
		t.Fatal("Unexpected the return value of GetRepoInfo()")
	}
}

func TestOpen(t *testing.T) {
	// Make a handle
	mdb := MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	db, err := mdb.Open()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	db.Close()

	// Make a handle with invalid argument
	mdb = MDB{
		Host:     "",
		User:     os.Getenv("MYSQL_USER"),
		Password: "",
		Database: os.Getenv("MYSQL_DATABASE")}
	db, err = mdb.Open()
	if err == nil {
		t.Fatal("Unexpected the return value on Open() with invalid arguments")
	}
	db.Close()
}
