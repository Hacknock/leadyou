package main

import (
	"Hacknock/gitHubAPI"
	"Hacknock/mDB"
	"Hacknock/monitorMemory"
	"Hacknock/recordLog"
	"Hacknock/typeName"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World")
}

type Values struct {
	Result string `json:"result"`
}

type GetCount struct {
	Result string `json:"result"`
	Count  int    `json:"count"`
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if "/" == r.URL.Path {
			fmt.Print("🐬")
			http.ServeFile(w, r, "./public/html/index.html")
			return
		} else if strings.ToLower(r.URL.Path) == "/favicon.icon" {
			http.ServeFile(w, r, "./public/images/favicon-black.ico")
		} else if strings.ToLower(r.URL.Path) == "/makereadme" {
			http.ServeFile(w, r, "./public/html/form.html")
		} else if strings.ToLower(r.URL.Path) == "/page" {
			http.ServeFile(w, r, "./public/html/document.html")
		} else if strings.ToLower(r.URL.Path) == "/getvalues" {
			// 🌟Replace This Block Later🌟
			value := Values{Result: "Success"}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			// getValues(query)
		} else if strings.ToLower(r.URL.Path) == "/getcount" {
			// 🌟Replace This Block Later🌟
			value := GetCount{Result: "Success", Count: 240}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			// getCount(query)
		} else if strings.ToLower(r.URL.Path) == "/countup" {
			// 🌟Replace This Block Later🌟
			value := Values{Result: "Failed"}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			//countUp(query)
		} else if strings.ToLower(r.URL.Path) == "/getlist" {
			// 🌟Replace This Block Later🌟
			value := Values{Result: "Success"}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			//getList(w)
		} else if strings.ToLower(r.URL.Path) == "/updatecatalog" {
			// 🌟Replace This Block Later🌟
			value := Values{Result: "Failed: this API requires a token"}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			// updateCatalog(query)
		} else if strings.ToLower(r.URL.Path) == "/showgeneratedtable" {
			// 🌟Replace This Block Later🌟
			value := Values{Result: "Failed: this API requires a token"}

			res, err := json.Marshal(value)

			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			w.Write(res)
			// updateCatalog(query)
		} else {
			fmt.Print("😹")
			http.NotFound(w, r)
			return
		}
	})

	http.Handle("/src/css/", http.StripPrefix("/src/css/", http.FileServer(http.Dir("public/css"))))
	http.Handle("/src/js/", http.StripPrefix("/src/js/", http.FileServer(http.Dir("public/js"))))
	http.Handle("/src/images/", http.StripPrefix("/src/images/", http.FileServer(http.Dir("public/images"))))
	http.Handle("/src/customdom/", http.StripPrefix("/src/customdom/", http.FileServer(http.Dir("public/plugins/custom-elements/"))))
	http.Handle("/src/json/", http.StripPrefix("/src/json/", http.FileServer(http.Dir("public/plugins/")))) // Should this line specify the *.json file?❓
	http.Handle("/src/md/", http.StripPrefix("/src/md/", http.FileServer(http.Dir("public/md/"))))

	http.ListenAndServe(":3001", nil)

	// r := recordLog.RecordLog{Level: 1, Path: "./text", File_name: "log.txt"}
	// r.Error("Hahaha")
	// m := monitorMemory.MonitorMemory{Path: "./test", File_name: "memory.txt"}
	// m.RecMemory(true, true)
	// mdb := mDB.MDB{
	// 	Path:     "/sqlite3",
	// 	Database: os.Getenv("MYSQL_DATABASE"),
	// 	Test:     true,
	// }
	// dummy := typeName.WhereParams{"aaa", "aaaaa"}
	// db, err := mdb.Init()

	// if db == nil || err != nil {
	// 	log.Fatal("Unexpected the return value on Open() with valid arguments")
	// }
	// ghapi := gitHubAPI.GitHubAPI{token: "test"}
	// ghapi.FetchReadme(dummy)
	// fmt.Print("Server Start")
	// fmt.Fprintf(os.Stdout, "Hello World")
	// log.Println("ニャホニャホタマクロー")
}

// func main() {
// 	r := recordLog.RecordLog{Level: 1, Path: "./text", File_name: "log.txt"}
// 	r.Error("Hahaha")
// 	m := monitorMemory.MonitorMemory{Path: "./test", File_name: "memory.txt"}
// 	m.RecMemory(true, true)
// 	mdb := mDB.MDB{
// 		Host:     "db",
// 		User:     os.Getenv("MYSQL_USER"),
// 		Password: os.Getenv("MYSQL_PASSWORD"),
// 		Database: os.Getenv("MYSQL_DATABASE")}
// 	dummy := typeName.WhereParams{"aaa", "aaaaa"}
// 	db, err := mdb.Open()
// 	if db == nil || err != nil {
// 		log.Fatal("Unexpected the return value on Open() with valid arguments")
// 	}
// 	ghapi := gitHubAPI.GitHubAPI{token: "test"}
// 	ghapi.FetchReadme(dummy)
// 	fmt.Print("Server Start")
// 	fmt.Fprintf(os.Stdout, "Hello World")
// 	log.Println("ニャホニャホタマクロー")
// 	http.HandleFunc("/", handler)
// 	http.ListenAndServe(":3001", nil)
// }
