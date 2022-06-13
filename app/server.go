package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World")
}

func main() {
	fmt.Print("Server Start")
	fmt.Fprintf(os.Stdout, "Hello World")
	log.Println("ニャホニャホタマクロー")
	http.HandleFunc("/", handler)
	http.ListenAndServe(":3001", nil)
}
