package main

import (
	"Hacknock/mDB"
	"Hacknock/monitorMemory"
	"Hacknock/recordLog"
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
	mdb.Test()
	fmt.Print("Server Start")
	fmt.Fprintf(os.Stdout, "Hello World")
	log.Println("ニャホニャホタマクロー")
	http.HandleFunc("/", handler)
	http.ListenAndServe(":3001", nil)
}
