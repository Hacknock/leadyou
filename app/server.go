package main

import (
	"Hacknock/gitHubAPI"
	"Hacknock/mDB"
	"Hacknock/monitorMemory"
	"Hacknock/recordLog"
	"Hacknock/typeName"
	"fmt"
	"log"
	"net/http"
	"os"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World")
}

func main() {
	r := recordLog.RecordLog{Level: 1, Path: "./text", File_name: "log.txt"}
	r.Error("Hahaha")
	m := monitorMemory.MonitorMemory{Path: "./test", File_name: "memory.txt"}
	m.RecMemory(true, true)
	mdb := mDB.MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	dummy := typeName.WhereParams{"aaa", "aaaaa"}
	db, err := mdb.Open()
	if db == nil || err != nil {
		log.Fatal("Unexpected the return value on Open() with valid arguments")
	}
	ghapi := gitHubAPI.GitHubAPI{token: "test"}
	ghapi.FetchReadme(dummy)
	fmt.Print("Server Start")
	fmt.Fprintf(os.Stdout, "Hello World")
	log.Println("ニャホニャホタマクロー")
	http.HandleFunc("/", handler)
	http.ListenAndServe(":3001", nil)
}
