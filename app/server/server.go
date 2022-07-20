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
	"strings"
	"time"
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

	// time.Sleep(time.Second * 10)
	// ticker.Stop()
	// close(stop)
}

func main() {

	termTask()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		switch strings.ToLower(r.URL.Path) {
		case "/":
			fmt.Print("🐬")
			http.ServeFile(w, r, "../client/html/index.html")
		case "/favicon.icon":
			http.ServeFile(w, r, "../client/images/favicon-black.ico")
		case "/makereadme":
			http.ServeFile(w, r, "../client/html/form.html")
		case "/page":
			http.ServeFile(w, r, "../client/html/document.html")
		case "/getvalues":
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
		case "/getcount":
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
		case "/countup":
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
		case "/getlist":
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
		case "/updatecatalog":
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
		case "/showgeneratedtable":
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
		default:
			fmt.Print("😹")
			http.NotFound(w, r)
		}

		// if r.URL.Path == "/" {
		// 	fmt.Print("🐬")
		// 	http.ServeFile(w, r, "../client/html/index.html")
		// 	return
		// } else if strings.ToLower(r.URL.Path) == "/favicon.icon" {
		// 	http.ServeFile(w, r, "../client/images/favicon-black.ico")
		// } else if strings.ToLower(r.URL.Path) == "/makereadme" {
		// 	http.ServeFile(w, r, "../client/html/form.html")
		// } else if strings.ToLower(r.URL.Path) == "/page" {
		// 	http.ServeFile(w, r, "../client/html/document.html")
		// } else if strings.ToLower(r.URL.Path) == "/getvalues" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := Values{Result: "Success"}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	// getValues(query)
		// } else if strings.ToLower(r.URL.Path) == "/getcount" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := GetCount{Result: "Success", Count: 240}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	// getCount(query)
		// } else if strings.ToLower(r.URL.Path) == "/countup" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := Values{Result: "Failed"}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	//countUp(query)
		// } else if strings.ToLower(r.URL.Path) == "/getlist" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := Values{Result: "Success"}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	//getList(w)
		// } else if strings.ToLower(r.URL.Path) == "/updatecatalog" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := Values{Result: "Failed: this API requires a token"}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	// updateCatalog(query)
		// } else if strings.ToLower(r.URL.Path) == "/showgeneratedtable" {
		// 	// 🌟Replace This Block Later🌟
		// 	value := Values{Result: "Failed: this API requires a token"}

		// 	res, err := json.Marshal(value)

		// 	if err != nil {
		// 		http.Error(w, err.Error(), http.StatusInternalServerError)
		// 		return
		// 	}

		// 	w.Header().Set("Content-Type", "application/json")
		// 	w.Write(res)
		// 	// showGeneratedTable(query)
		// } else {
		// 	fmt.Print("😹")
		// 	http.NotFound(w, r)
		// 	return
		// }
	})

	http.Handle("/src/css/", http.StripPrefix("/src/css/", http.FileServer(http.Dir("../client/css"))))
	http.Handle("/src/js/", http.StripPrefix("/src/js/", http.FileServer(http.Dir("../client/js"))))
	http.Handle("/src/images/", http.StripPrefix("/src/images/", http.FileServer(http.Dir("../client/images"))))
	http.Handle("/src/customdom/", http.StripPrefix("/src/customdom/", http.FileServer(http.Dir("../client/plugins/custom-elements/"))))
	http.Handle("/src/json/", http.StripPrefix("/src/json/", http.FileServer(http.Dir("../client/plugins/")))) // Should this line specify the *.json file?❓
	http.Handle("/src/md/", http.StripPrefix("/src/md/", http.FileServer(http.Dir("../client/md/"))))

	http.ListenAndServe(":3001", nil)

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
