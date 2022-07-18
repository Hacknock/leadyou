package mDB

import (
	"Hacknock/typeName"
	"fmt"
	"os"
	"testing"
)

func TestInit(t *testing.T) {
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal(err)
	}

	db.Close()
}

func TestUpdateDefaultBranch(t *testing.T) {
	// Make a handle
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments on TestUpdateTsRepo\n" + err.Error())
	}

	param := RepoInfo{Owner: "branchChangeTest", Repo: "test", Branch: "develop"}

	err = sqdb.UpdateDefaultBranch(param)
	if err != nil {
		t.Fatal("Failed to update the default branch of the repository.\n" + err.Error())
	}

	var branch string

	err = db.QueryRow(`select branch from generated where owner = ? and repository = ?`, param.Owner, param.Repo).Scan(&branch)
	defer db.Close()

	if err != nil {
		t.Fatal("Failed to get branch from repository.\n" + err.Error())
	}

	if branch == "main" {
		t.Fatal("The default branch was not changed.\n" + err.Error())
	}
}

func TestUpdateTsRepo(t *testing.T) {
	// Make a handle
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments on TestUpdateTsRepo")
	}

	// parameter to delete the record
	param := typeName.WhereParams{Owner: "deletedTest", Repo: "test"}

	err = sqdb.UpdateTsRepo(param)
	if err != nil {
		t.Fatal("Failed to update ts")
	}

	var ts string

	err = db.QueryRow(`select ts from generated where owner = ? and repository = ?`, param.Owner, param.Repo).Scan(&ts)
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
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments on TestDeleteRepo\n" + err.Error())
	}

	// parameter to delete the record
	param := typeName.WhereParams{Owner: "deletedTest", Repo: "test"}

	// Check the record to be deleted
	info, err := sqdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo {
		t.Fatal("Unexpected the return value of GetRepoInfo() on TestDeleteRepo\n" + err.Error())
	}

	err = sqdb.DeleteRepo(param)
	if err != nil {
		t.Fatal("An error is occurred on TestDeleteRepo.\n" + err.Error())
	}

	var ts string
	err = db.QueryRow(`select ts from generated where owner = ? and repository = ?`, param.Owner, param.Repo).Scan(&ts)
	defer db.Close()

	fmt.Print("🐡")
	fmt.Println(ts)

	// // Check the record to be deleted
	// info, err = sqdb.GetRepoInfo(param)

	if err == nil {
		fmt.Print("🐙")
		fmt.Println(info.Owner, info.Repo, info.Branch)
		t.Fatal("Unexpected the return value of GetRepoInfo() after deleting on TestDeleteRepo\n")
	}
}

func TestGetRepoBranchNotNil(t *testing.T) {
	// Make a handle
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	correct := []RepoInfo{
		{Owner: "panda", Repo: "hogehoge", Branch: "main"},
		{Owner: "bird", Repo: "esa", Branch: "develop"},
		{Owner: "cup", Repo: "sakana", Branch: "chance"},
		{Owner: "clock", Repo: "ball", Branch: "change"},
		{Owner: "world", Repo: "cheese", Branch: "bug-fix"},
	}

	infos, err := sqdb.GetRepoBranchNotNil(5) // Get repository information does not have branch
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
		{Owner: "bird", Repo: "esa", Branch: "develop"},
		{Owner: "cup", Repo: "sakana", Branch: "chance"},
		{Owner: "clock", Repo: "ball", Branch: "change"},
		{Owner: "world", Repo: "cheese", Branch: "bug-fix"},
	}

	infos, err = sqdb.GetRepoBranchNotNil(4) // Get repository information does not have branch
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
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	correct := []RepoInfo{
		{Owner: "Hacknock", Repo: "hogehoge", Branch: ""},
		{Owner: "neconecopo", Repo: "esa", Branch: ""},
		{Owner: "penguin", Repo: "sakana", Branch: ""},
		{Owner: "dog", Repo: "ball", Branch: ""},
		{Owner: "mouse", Repo: "cheese", Branch: ""},
	}

	infos, err := sqdb.GetRepoBranchNil(5) // Get repository information does not have branch
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
		{Owner: "penguin", Repo: "sakana", Branch: ""},
		{Owner: "dog", Repo: "ball", Branch: ""},
		{Owner: "mouse", Repo: "cheese", Branch: ""},
	}

	infos, err = sqdb.GetRepoBranchNil(3) // Get repository information does not have branch
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
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	// Insert Repository
	param := typeName.WhereParams{Owner: "App", Repo: "beta"}
	err = sqdb.InsertRepo(param)
	if err != nil {
		t.Fatal("Failed to insert record of new repository")
	}

	// Check the inserted record
	var info RepoInfo
	info, err = sqdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "" {
		t.Fatal("Unexpected the return value of GetRepoInfo() without branch name on insert")
	}
}

func TestGet(t *testing.T) {
	// Make a handle
	sqdb := MDB{
		Path:     "/sqlite3",
		Database: os.Getenv("MYSQL_DATABASE"),
		Test:     true,
	}

	db, err := sqdb.Init()
	if db == nil || err != nil {
		t.Fatal("Unexpected the return value on Open() with valid arguments")
	}

	// Get repository info with branch name is filled
	param := typeName.WhereParams{Owner: "Hacknock", Repo: "test"}
	info, err := sqdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "main" {
		t.Fatal("Unexpected the return value of GetRepoInfo() with branch name")
	}

	// Get repository info without branch name is filled
	param = typeName.WhereParams{Owner: "Hacknock", Repo: "hogehoge"}
	info, err = sqdb.GetRepoInfo(param)
	if err != nil || info.Owner != param.Owner || info.Repo != param.Repo || info.Branch != "" {
		t.Fatal("Unexpected the return value of GetRepoInfo() without branch name")
	}

	// Get not existed repository information
	param = typeName.WhereParams{Owner: "Hacknock", Repo: "neco"}
	info, err = sqdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
	}

	param = typeName.WhereParams{Owner: "Hogeneco", Repo: "test"}
	info, err = sqdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
	}

	param = typeName.WhereParams{Owner: "Hogeneco", Repo: "neco"}
	info, err = sqdb.GetRepoInfo(param)
	if err == nil {
		t.Fatal("Unexpected the return value of GetRepoInfo() of not existed Repository")
	}

}
