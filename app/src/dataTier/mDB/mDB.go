package mDB

import (
	"database/sql"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

type MDB struct {
	Path     string
	Database string
}

// type WhereParams struct {
// 	Owner string
// 	Repo  string
// }

type RepoInfo struct {
	Owner  string
	Repo   string
	Branch string
}

// create tables
func (m MDB) Init(test, force bool) error {
	if force == true {
		os.Remove(m.Path + "/leadyou.db")
	}
	db, err := sql.Open("sqlite3", m.Path+"/leadyou.db")
	if err != nil {
		return err
	}
	defer db.Close()

	sqlStmt := `
	create table if not exists generated (
    ts DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner VARCHAR (256),
    repository VARCHAR (256),
    branch VARCHAR (256) NULL
	);`

	sqlTest := `
	insert into generated(ts, owner, repository, branch)
	values('2030-06-27 04:02:32', 'deletedTest', 'test', 'main');

	insert into generated(ts, owner, repository, branch)
	values('2030-06-27 05:02:32', 'branchChangeTest', 'test', 'main');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:02:32', 'Hacknock', 'test', 'main');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:03:32', 'panda', 'hogehoge', 'main');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:04:32', 'bird', 'esa', 'develop');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:05:32', 'cup', 'sakana', 'chance');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:06:32', 'clock', 'ball', 'change');

	insert into generated(ts, owner, repository, branch)
	values('2042-06-27 04:07:32', 'world', 'cheese', 'bug-fix');

	insert into generated(ts, owner, repository)
	values('2042-06-27 04:02:32', 'Hahaha', 'cook');

	insert into generated(ts, owner, repository)
	values('2042-06-28 04:02:42','Hacknock', 'hogehoge');

	insert into generated(ts, owner, repository)
	values('2042-06-28 04:03:32','neconecopo', 'esa');

	insert into generated(ts, owner, repository)
	values('2042-06-28 04:03:42','penguin', 'sakana');

	insert into generated(ts, owner, repository)
	values('2042-06-28 04:04:52','dog', 'ball');

	insert into generated(ts, owner, repository)
	values('2042-06-28 04:05:32','mouse', 'cheese');
	`

	var exeSql string
	if test == true {
		exeSql = sqlStmt + sqlTest
	} else {
		exeSql = sqlStmt
	}

	_, err = db.Exec(exeSql)
	if err != nil {
		return err
	}
	return nil
}

// func (m MDB) UpdateDefaultBranch(p RepoInfo) error {
// 	// Make a connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return err
// 	}
// 	defer db.Close()

// 	// update
// 	stmtIns, err := db.Prepare("update " + m.Database + ".generated set branch = ? where owner = ? and repository = ?")
// 	if err != nil {
// 		return errors.New(err.Error())
// 	}
// 	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

// 	_, err = stmtIns.Exec(p.Branch, p.Owner, p.Repo)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (m MDB) UpdateTsRepo(p typeName.WhereParams) error {
// 	// Make a connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return err
// 	}
// 	defer db.Close()

// 	// update
// 	stmtIns, err := db.Prepare("update " + m.Database + ".generated set ts = ? where owner = ? and repository = ?")
// 	if err != nil {
// 		return errors.New(err.Error())
// 	}
// 	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

// 	time_now := time.Now()
// 	const layout = "2006-01-02 15:04:05"
// 	time_data := time_now.Format(layout)

// 	_, err = stmtIns.Exec(time_data, p.Owner, p.Repo)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }

// func (m MDB) DeleteRepo(p typeName.WhereParams) error {
// 	// Make a connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return err
// 	}
// 	defer db.Close()

// 	stmtIns, err := db.Prepare("delete from " + m.Database + ".generated where owner = ? and repository = ?")
// 	if err != nil {
// 		return errors.New(err.Error())
// 	}
// 	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

// 	_, err = stmtIns.Exec(p.Owner, p.Repo)
// 	if err != nil {
// 		return err
// 	}
// 	return nil
// }

// func (m MDB) GetRepoBranchNotNil(num int) ([]RepoInfo, error) {
// 	// Make a connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}
// 	defer db.Close()

// 	rows, err := db.Query("SELECT * FROM leadyou.generated where branch is not null order by ts desc limit ?", num)
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}
// 	// Get column names
// 	columns, err := rows.Columns()
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}

// 	values := make([]sql.RawBytes, len(columns)) // Allocate the length of slice

// 	scanArgs := make([]interface{}, len(values))
// 	for i := range values {
// 		scanArgs[i] = &values[i]
// 	}

// 	var returnedValue []RepoInfo

// 	for rows.Next() {
// 		err = rows.Scan(scanArgs...)
// 		if err != nil {
// 			return []RepoInfo{}, err
// 		}

// 		v := RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: string(values[3])}
// 		returnedValue = append(returnedValue, v)
// 	}

// 	return returnedValue, nil
// }

// // Get repository information does not have branch
// func (m MDB) GetRepoBranchNil(num int) ([]RepoInfo, error) {
// 	// Make a connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}
// 	defer db.Close()

// 	rows, err := db.Query("SELECT * FROM leadyou.generated where branch is null order by ts desc limit ?", num)
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}
// 	// Get column names
// 	columns, err := rows.Columns()
// 	if err != nil {
// 		return []RepoInfo{}, err
// 	}

// 	values := make([]sql.RawBytes, len(columns)) // Allocate the length of slice

// 	scanArgs := make([]interface{}, len(values))
// 	for i := range values {
// 		scanArgs[i] = &values[i]
// 	}

// 	var returnedValue []RepoInfo

// 	for rows.Next() {
// 		err = rows.Scan(scanArgs...)
// 		if err != nil {
// 			return []RepoInfo{}, err
// 		}

// 		v := RepoInfo{Owner: string(values[1]), Repo: string(values[2]), Branch: ""}
// 		returnedValue = append(returnedValue, v)
// 	}

// 	return returnedValue, nil
// }

// // Insert repository information
// func (m MDB) InsertRepo(p typeName.WhereParams) error {
// 	db, err := m.Open()
// 	if err != nil {
// 		return err
// 	}
// 	defer db.Close()

// 	stmtIns, err := db.Prepare("insert into " + m.Database + ".generated(owner, repository) values( ?, ? )")
// 	if err != nil {
// 		return errors.New(err.Error())
// 	}
// 	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

// 	stmtIns.Exec(p.Owner, p.Repo)
// 	return nil
// }

// // Get repository information
// func (m MDB) GetRepoInfo(p typeName.WhereParams) (RepoInfo, error) {
// 	// Establish the connection to DB
// 	db, err := m.Open()
// 	if err != nil {
// 		return RepoInfo{}, err
// 	}
// 	defer db.Close()

// 	var owner, repo, branch *string

// 	err = db.QueryRow(`select owner, repository, branch from `+m.Database+`.generated where owner = ? and repository = ?`, p.Owner, p.Repo).Scan(&owner, &repo, &branch)

// 	if err != nil {
// 		return RepoInfo{}, err
// 	}

// 	var val RepoInfo

// 	if branch == nil {
// 		val = RepoInfo{Owner: *owner, Repo: *repo, Branch: ""}
// 	} else {
// 		val = RepoInfo{Owner: *owner, Repo: *repo, Branch: *branch}
// 	}

// 	return val, nil
// }

// // Open's document; https://github.com/go-sql-driver/mysql/wiki/Examples
// func (m MDB) Open() (*sql.DB, error) {
// 	db, err := sql.Open("mysql", m.User+":"+m.Password+"@"+"tcp("+m.Host+":3306)"+"/"+m.Database)
// 	if err != nil {
// 		return db, err
// 	}

// 	err = db.Ping()
// 	if err != nil {
// 		return db, err
// 	}
// 	return db, nil
// }
