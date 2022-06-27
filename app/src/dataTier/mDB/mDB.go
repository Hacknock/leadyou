package mDB

import (
	"database/sql"

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

// Get repository information
func (m MDB) GetRepoInfo(p WhereParams) (RepoInfo, error) {
	val := RepoInfo{Owner: p.Owner, Repo: p.Repo, Branch: "main"}
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

func (m MDB) InsertRepo(p WhereParams) error {
	db, err := m.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	stmtIns, err := db.Prepare("insert into " + m.Database + ".generated(owner, repository) values( ?, ? )")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	stmtIns.Exec(p.Owner, p.Repo)
	return nil
}
