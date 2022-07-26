package main

import (
	// "Hacknock/database"
	// "Hacknock/github"
	// "Hacknock/logger"
	// "Hacknock/monitor"
	// "Hacknock/repository"
	// "Hacknock/structure"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Values struct {
	Result string `json:"result"`
}

type GetCount struct {
	Result string `json:"result"`
	Count  int    `json:"count"`
}

func termTask() {
	ticker := time.NewTicker(time.Second * 1)

	stop := make(chan bool)

	go func() {
	loop:
		for {
			select {
			case t := <-ticker.C:
				fmt.Println("🐾 at ", t)
			case <-stop:
				break loop
			}
		}
		fmt.Println("Reachable")
	}()
}

func main() {

	termTask()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("😹")
		http.ServeFile(w, r, "../client/html/index.html")
	})

	r.Get("/favicon.icon", func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("🐳")
		http.ServeFile(w, r, "../client/images/favicon-black.ico")
	})

	r.Get("/makereadme", func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("🐬")
		http.ServeFile(w, r, "../client/html/form.html")
	})

	r.Get("/page", func(w http.ResponseWriter, r *http.Request) {
		fmt.Print("🐙")
		http.ServeFile(w, r, "../client/html/document.html")
	})

	r.Get("/getvalues", func(w http.ResponseWriter, r *http.Request) {
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
	})

	r.Get("/getcount", func(w http.ResponseWriter, r *http.Request) {
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
	})

	r.Get("/countup", func(w http.ResponseWriter, r *http.Request) {
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
	})

	r.Get("/getlist", func(w http.ResponseWriter, r *http.Request) {
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
	})

	r.Get("/updatecatalog", func(w http.ResponseWriter, r *http.Request) {
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
	})

	r.Get("/showgeneratedtable", func(w http.ResponseWriter, r *http.Request) {
		// 🌟Replace This Block Later🌟
		value := Values{Result: "Failed: this API requires a token"}

		res, err := json.Marshal(value)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(res)
		// showGeneratedTable(query)
	})

	r.Handle("/src/css/*", http.StripPrefix("/src/css/", http.FileServer(http.Dir("../client/css"))))
	r.Handle("/src/js/*", http.StripPrefix("/src/js/", http.FileServer(http.Dir("../client/js"))))
	r.Handle("/src/images/*", http.StripPrefix("/src/images/", http.FileServer(http.Dir("../client/images"))))
	r.Handle("/src/customdom/*", http.StripPrefix("/src/customdom/", http.FileServer(http.Dir("../client/plugins/custom-elements/"))))
	r.Handle("/src/json/*", http.StripPrefix("/src/json/", http.FileServer(http.Dir("../client/plugins/")))) // Should this line specify the *.json file?❓
	r.Handle("/src/md/*", http.StripPrefix("/src/md/", http.FileServer(http.Dir("../client/md/"))))

	PORT := ":" + os.Getenv("WEB_PORT")

	http.ListenAndServe(PORT, r)

	// r := logger.RecordLog{Level: 1, Path: "./text", File_name: "log.txt"}
	// r.Error("Hahaha")
	// m := monitor.MonitorMemory{Path: "./test", File_name: "memory.txt"}
	// m.RecMemory(true, true)
	// mdb := database.MDB{
	// 	Path:     "/sqlite3",
	// 	Database: os.Getenv("MYSQL_DATABASE"),
	// 	Test:     true,
	// }
	// dummy := structure.WhereParams{"aaa", "aaaaa"}
	// db, err := mdb.Init()

	// if db == nil || err != nil {
	// 	log.Fatal("Unexpected the return value on Open() with valid arguments")
	// }
	// ghapi := github.GitHubAPI{token: "test"}
	// ghapi.FetchReadme(dummy)
	// fmt.Print("Server Start")
	// fmt.Fprintf(os.Stdout, "Hello World")
	// log.Println("ニャホニャホタマクロー")
	// getRD := repository.GetRepoData{}
	// num, err := getRD.GetCount()
}
