package main

import (
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
	r := recordLog.RecordLog{Level: 1, Path: "a", File_name: "a"}
	r.Error("Hahaha")
	fmt.Print("Server Start")
	fmt.Fprintf(os.Stdout, "Hello World")
	log.Println("ニャホニャホタマクロー")
	http.HandleFunc("/", handler)
	http.ListenAndServe(":3001", nil)
}
