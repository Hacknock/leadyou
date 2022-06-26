package mDB

import (
	"database/sql"
	"log"

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

// Open's document; https://github.com/go-sql-driver/mysql/wiki/Examples
func (m MDB) Open() (db *sql.DB, err error) {
	db, er := sql.Open("mysql", m.User+":"+m.Password+"@"+"tcp("+m.Host+":3306)"+"/"+m.Database)
	if er != nil {
		log.Fatal(er)
		return nil, err
	}
	return db, nil
}

func (m MDB) InsertRepo(p WhereParams) error {
	db, err := m.Open()
	if err != nil {
		log.Fatal(err)
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

func (m MDB) Test() {
	db, er := sql.Open("mysql", m.User+":"+m.Password+"@"+"tcp("+m.Host+":3306)"+"/"+m.Database)
	if er != nil {
		log.Fatal(er)
	}
	defer db.Close()

	er = db.Ping()
	if er != nil {
		panic(er.Error())
	}

	stmtIns, err := db.Prepare("insert into " + m.Database + ".generated(owner, repository) values( ?, ? )")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}
	defer stmtIns.Close() // Close the statement when we leave main() / the program terminates

	stmtIns.Exec("Hacknock", "testdayo")

	// rows, e := db.Query("SELECT * FROM leadyou.generated")
	// if e != nil {
	// 	panic(e)
	// }
	// // Get column names
	// columns, err := rows.Columns()
	// if err != nil {
	// 	panic(err.Error()) // proper error handling instead of panic in your app
	// }

	// values := make([]sql.RawBytes, len(columns))

	// scanArgs := make([]interface{}, len(values))
	// for i := range values {
	// 	scanArgs[i] = &values[i]
	// }

	// for rows.Next() {
	// 	err = rows.Scan(scanArgs...)
	// 	if err != nil {
	// 		panic(err.Error()) // proper error handling instead of panic in your app
	// 	}

	// 	var value string
	// 	for i, col := range values {
	// 		// Here we can check if the value is nil (NULL value)
	// 		if col == nil {
	// 			value = "NULL"
	// 		} else {
	// 			value = string(col)
	// 		}
	// 		fmt.Println(columns[i], ": ", value)
	// 	}
	// 	fmt.Println("-----------------------------------")
	// }
	// if err = rows.Err(); err != nil {
	// 	panic(err.Error()) // proper error handling instead of panic in your app
	// }
}
