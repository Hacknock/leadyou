package database

import (
	"Hacknock/structure"
	"database/sql"
	"errors"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	Path     string
	Database string
}

type RepoInfo struct {
	Owner  string
	Repo   string
	Branch string
}

// create tables on Initialization
func (d Database) Init() error {
	p := d.Path + "/leadyou.db" // The path to save database
	db, err := sql.Open("sqlite3", p)
	if err != nil {
		return err
	}
	defer db.Close()

	sqlStmt := `
	create table if not exists generated (
    ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL,
		unique(owner, repository)
	);`

	_, err = db.Exec(sqlStmt)
	if err != nil {
		return err
	}
	return nil
}

// Make the connection
func (d Database) Open() (*sql.DB, error) {
	p := d.Path + "/leadyou.db" // The path to save database
	db, err := sql.Open("sqlite3", p)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func (d Database) UpdateDefaultBranch(p RepoInfo) error {
	// Make a connection to DB
	db, err := d.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	// update
	stmtIns, err := db.Prepare("update generated set branch = ? where owner = ? and repository = ?")
	if err != nil {
		return errors.New(err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	_, err = stmtIns.Exec(p.Branch, p.Owner, p.Repo)
	if err != nil {
		return err
	}

	return nil
}

func (d Database) UpdateTsRepo(p structure.WhereParams) error {
	// Make a connection to DB
	db, err := d.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	// update
	stmtIns, err := db.Prepare("update generated set ts = ? where owner = ? and repository = ?")
	if err != nil {
		return errors.New(err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	now := time.Now()
	const layout = "2006-01-02 15:04:05"
	time_data := now.Format(layout)

	_, err = stmtIns.Exec(time_data, p.Owner, p.Repo)
	if err != nil {
		return err
	}
	return nil
}

func (d Database) DeleteRepo(p structure.WhereParams) error {
	// Make a connection to DB
	db, err := d.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	stmtIns, err := db.Prepare("delete from generated where owner = ? and repository = ?")
	if err != nil {
		return errors.New(err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	_, err = stmtIns.Exec(p.Owner, p.Repo)
	if err != nil {
		return err
	}
	return nil
}

func (d Database) GetRepoBranchNotNil(num int) ([]RepoInfo, error) {
	// Make a connection to DB
	db, err := d.Open()
	if err != nil {
		return []RepoInfo{}, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM generated where branch is not null order by ts desc limit ?", num)
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

		v := RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: string(values[3])}
		returnedValue = append(returnedValue, v)
	}

	return returnedValue, nil
}

// Get repository information does not have branch
func (d Database) GetRepoBranchAll(num int) ([]RepoInfo, error) {
	// Make a connection to DB
	db, err := d.Open()
	if err != nil {
		return []RepoInfo{}, err
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM generated order by ts desc limit ?", num)
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
		var v RepoInfo
		if values[3] == nil {
			v = RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: ""}
		} else {
			v = RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: string(values[3])}
		}

		returnedValue = append(returnedValue, v)
	}

	return returnedValue, nil
}

// Insert repository information
func (d Database) InsertRepo(p structure.WhereParams) error {
	db, err := d.Open()
	if err != nil {
		return err
	}
	defer db.Close()

	// Make a transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	stmtIns, err := tx.Prepare("insert into generated(owner, repository) values( ?, ? )")
	if err != nil {
		return errors.New(err.Error())
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates
	stmtIns.Exec(p.Owner, p.Repo)

	err = tx.Commit() //Commit insert statement
	if err != nil {
		return err
	}

	return nil
}

// Get repository information
func (d Database) GetRepoInfo(p structure.WhereParams) (RepoInfo, error) {
	// Establish the connection to DB
	db, err := d.Open()
	if err != nil {
		return RepoInfo{}, err
	}
	defer db.Close()

	var owner, repo, branch *string

	err = db.QueryRow(`select owner, repository, branch from generated where owner = ? and repository = ?`, p.Owner, p.Repo).Scan(&owner, &repo, &branch)

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
