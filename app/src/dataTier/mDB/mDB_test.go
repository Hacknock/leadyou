package mDB

import (
	"os"
	"testing"
)

func TestUpdateTsRepo(t *testing.T) {
	// Make a handle
	mdb := MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	db, err := mdb.Open()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments on TestUpdateTsRepo")
	}

	// parameter to delete the record
	param := WhereParams{Owner: "deletedTest", Repo: "test"}

	err = mdb.UpdateTsRepo(param)
	if err != nil {
		t.Fatal("Failed to update ts")
	}

	var ts string

	err = db.QueryRow(`select ts from `+os.Getenv("MYSQL_DATABASE")+`.generated where owner = ? and repository = ?`, param.Owner, param.Repo).Scan(&ts)
	defer db.Close()

	if err != nil {
		t.Fatal("Failed to check ts after updating")
	}

	if ts == "2042-06-27 04:02:32" {
		t.Fatal("ts was not updated.")
	}

}

func TestDeleteRepo(t *testing.T) {
	// Make a handle
	mdb := MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	db, err := mdb.Open()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments on TestDeleteRepo")
	}

	// parameter to delete the record
	param := WhereParams{Owner: "deletedTest", Repo: "test"}

	// Check the record to be deleted
	info, err := mdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo {
		t.Fatal("Unexpected the return value of GetRepoInfo() on TestDeleteRepo")
	}

	err = mdb.DeleteRepo(param)
	if err != nil {
		t.Fatal("An error is occurred on TestDeleteRepo.")
	}

	// Check the record to be deleted
	info, err = mdb.GetRepoInfo(param)

	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() after deleting on TestDeleteRepo")
	}
}

func TestGetRepoBranchNotNil(t *testing.T) {
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

	correct := []RepoInfo{
		RepoInfo{Owner: "panda", Repo: "hogehoge", Branch: "main"},
		RepoInfo{Owner: "bird", Repo: "esa", Branch: "develop"},
		RepoInfo{Owner: "cup", Repo: "sakana", Branch: "chance"},
		RepoInfo{Owner: "clock", Repo: "ball", Branch: "change"},
		RepoInfo{Owner: "world", Repo: "cheese", Branch: "bug-fix"},
	}

	infos, err := mdb.GetRepoBranchNotNil(5) // Get repository information does not have branch
	for _, k := range infos {
		for i, j := range correct {
			if j == k {
				break
			}
			if i+1 == len(correct) {
				t.Fatal("not found")
			}
		}
	}

	correct = []RepoInfo{
		RepoInfo{Owner: "bird", Repo: "esa", Branch: "develop"},
		RepoInfo{Owner: "cup", Repo: "sakana", Branch: "chance"},
		RepoInfo{Owner: "clock", Repo: "ball", Branch: "change"},
		RepoInfo{Owner: "world", Repo: "cheese", Branch: "bug-fix"},
	}

	infos, err = mdb.GetRepoBranchNotNil(4) // Get repository information does not have branch
	for _, k := range infos {
		for i, j := range correct {
			if j == k {
				break
			}
			if i+1 == len(correct) {
				t.Fatal("not found")
			}
		}
	}
}
func TestGetRepoBranchNil(t *testing.T) {
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

	correct := []RepoInfo{
		RepoInfo{Owner: "Hacknock", Repo: "hogehoge", Branch: ""},
		RepoInfo{Owner: "neconecopo", Repo: "esa", Branch: ""},
		RepoInfo{Owner: "penguin", Repo: "sakana", Branch: ""},
		RepoInfo{Owner: "dog", Repo: "ball", Branch: ""},
		RepoInfo{Owner: "mouse", Repo: "cheese", Branch: ""},
	}

	infos, err := mdb.GetRepoBranchNil(5) // Get repository information does not have branch
	for _, k := range infos {
		for i, j := range correct {
			if j == k {
				break
			}
			if i+1 == len(correct) {
				t.Fatal("not found")
			}
		}
	}

	correct = []RepoInfo{
		RepoInfo{Owner: "penguin", Repo: "sakana", Branch: ""},
		RepoInfo{Owner: "dog", Repo: "ball", Branch: ""},
		RepoInfo{Owner: "mouse", Repo: "cheese", Branch: ""},
	}

	infos, err = mdb.GetRepoBranchNil(3) // Get repository information does not have branch
	for _, k := range infos {
		for i, j := range correct {
			if j == k {
				break
			}
			if i+1 == len(correct) {
				t.Fatal("not found")
			}
		}
	}
}

func TestInsert(t *testing.T) {
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

	// Insert Repository
	param := WhereParams{Owner: "App", Repo: "beta"}
	err = mdb.InsertRepo(param)
	if err != nil {
		t.Fatal("Failed to insert record of new repository")
	}

	// Check the inserted record
	var info RepoInfo
	info, err = mdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "" {
		t.Fatal("Unexpected the return value of GetRepoInfo() without branch name on insert")
	}
}

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
