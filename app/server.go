package main

import (
	// "Hacknock/gitHubAPI"
	// "Hacknock/mDB"
	// "Hacknock/monitorMemory"
	// "Hacknock/recordLog"
	// "Hacknock/typeName"
	// "Hacknock/getRepoData"

	"Hacknock/monitorMemory"
	"Hacknock/recordLog"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
)

type Values struct {
	Result string `json:"result"`
}

type GetCount struct {
	Result string `json:"result"`
	Count  int    `json:"count"`
}

func termTask() {
	// memory monitoring
	m := monitorMemory.MonitorMemory{Path: "./test", File_name: "memory.txt"}
	ticker := time.NewTicker(time.Second * 10)
	defer ticker.Stop()
	count := 0
	for {
		select {
		case <-ticker.C:
			m.RecMemory(true, true) // Memory monitoring
			// UpdateCatalog
			count++
		default:
			continue
		}
	}
}

func main() {

	// log initialization
	r := recordLog.RecordLog{Level: 1, Path: "./text", File_name: "log.txt"}

	// periodic task
	go termTask()

	// Use echo
	e := echo.New()

	// Top page
	e.GET("/", func(c echo.Context) error {
		return c.File("./public/html/index.html")
	})

	// favicon
	e.GET("/favicon.icon", func(c echo.Context) error {
		return c.File("./public/images/favicon-black.ico")
	})

	// makereadme (generate readme.md)
	e.GET("/makereadme", func(c echo.Context) error {
		return c.File("./public/html/form.html")
	})

	// document
	e.GET("/page", func(c echo.Context) error {
		return c.File("./public/html/document.html")
	})

	// getvalue
	e.GET("/getvalue", func(c echo.Context) error {
		r.Log("Called /getvalue")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// getcount
	e.GET("/getcount", func(c echo.Context) error {
		r.Log("Called /getcount")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// countup
	e.GET("/countup", func(c echo.Context) error {
		r.Log("Called /countup")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// getlist
	e.GET("/getlist", func(c echo.Context) error {
		r.Log("Called /getlist")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// updatecatalog
	e.GET("/updatecatalog", func(c echo.Context) error {
		r.Log("Called /updatecatalog")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// showgeneratedtable
	e.GET("/showgeneratedtable", func(c echo.Context) error {
		r.Log("Called /showgeneratedtable")
		// 🌟Replace This Block Later🌟
		var value Values
		value.Result = "Success"

		return c.JSON(http.StatusOK, value)
	})

	// css files
	e.Static("/src/css/", "public/css")
	e.Static("/src/js/", "public/js")
	e.Static("/src/images/", "public/images")
	e.Static("/src/customdom/", "public/plugins/custom-elements/")
	e.Static("/src/json/", "public/plugins/")
	e.Static("/src/md/", "public/md/")

	e.Logger.Fatal(e.Start(":" + os.Getenv("WEB_PORT")))

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
