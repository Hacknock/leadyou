package mDB

import (
	"database/sql"
	"errors"

	_ "github.com/go-sql-driver/mysql"
)

type MDB struct {
	Host     string
	User     string
	Password string
	Database string
}

type WhereParams struct {
	Owner string
	Repo  string
}

type RepoInfo struct {
	Owner  string
	Repo   string
	Branch string
}

// Insert repository information
func (m MDB) InsertRepo(p WhereParams) error {
	db, err := m.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	stmtIns, err := db.Prepare("insert into " + m.Database + ".generated(owner, repository) values( ?, ? )")
	if err != nil {
		return errors.New(err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	stmtIns.Exec(p.Owner, p.Repo)
	return nil
}

// Get repository information
func (m MDB) GetRepoInfo(p WhereParams) (RepoInfo, error) {
	// Establish the connection to DB
	db, err := m.Open()
	if err != nil {
		return RepoInfo{}, err
	}
	defer db.Close()

	var owner, repo, branch *string

	err = db.QueryRow(`select owner, repository, branch from `+m.Database+`.generated where owner = ? and repository = ?`, p.Owner, p.Repo).Scan(&owner, &repo, &branch)

	if err != nil {
		return RepoInfo{}, err
	}

	var val RepoInfo

	if branch == nil {
		val = RepoInfo{Owner: *owner, Repo: *repo, Branch: ""}
	} else {
		val = RepoInfo{Owner: *owner, Repo: *repo, Branch: *branch}
	}

	return val, nil
}

// Open's document; https://github.com/go-sql-driver/mysql/wiki/Examples
func (m MDB) Open() (*sql.DB, error) {
	db, err := sql.Open("mysql", m.User+":"+m.Password+"@"+"tcp("+m.Host+":3306)"+"/"+m.Database)
	if err != nil {
		return db, err
	}

	err = db.Ping()
	if err != nil {
		return db, err
	}
	return db, nil
}
