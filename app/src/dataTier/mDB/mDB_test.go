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

	// Get repository info with branch name is filled
	param := WhereParams{Owner: "Hacknock", Repo: "test"}
	info, err := mdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "main" {
		t.Fatal("Unexpected the return value of GetRepoInfo() with branch name")
	}

	// Get repository info without branch name is filled
	param = WhereParams{Owner: "Hacknock", Repo: "hogehoge"}
	info, err = mdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "" {
		t.Fatal("Unexpected the return value of GetRepoInfo() without branch name")
	}

	// Get not existed repository information
	param = WhereParams{Owner: "Hacknock", Repo: "neco"}
	info, err = mdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
	}

	param = WhereParams{Owner: "Hogeneco", Repo: "test"}
	info, err = mdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
	}

	param = WhereParams{Owner: "Hogeneco", Repo: "neco"}
	info, err = mdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
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
