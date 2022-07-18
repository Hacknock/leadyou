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

// Get repository information does not have branch
func (m MDB) GetRepoBranchNil(num int) ([]RepoInfo, error) {
	// Make a connection to DB
	db, err := m.Open()
	if err != nil {
		return []RepoInfo{}, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM leadyou.generated where branch is null order by ts desc limit ?", num)
	if err != nil {
		return []RepoInfo{}, err
	}
	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		return []RepoInfo{}, err
	}

	values := make([]sql.RawBytes, len(columns)) // Allocate the length of slice

	scanArgs := make([]interface{}, len(values))
	for i := range values {
		scanArgs[i] = &values[i]
	}

	var returnedValue []RepoInfo

	for rows.Next() {
		err = rows.Scan(scanArgs...)
		if err != nil {
			return []RepoInfo{}, err
		}

		v := RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: ""}
		returnedValue = append(returnedValue, v)
	}

	return returnedValue, nil
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
