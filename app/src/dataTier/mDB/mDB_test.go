package mDB

import (
	"os"
	"testing"
)

func TestHello(t *testing.T) {
	mdb := MDB{
		Host:     "db",
		User:     os.Getenv("MYSQL_USER"),
		Password: os.Getenv("MYSQL_PASSWORD"),
		Database: os.Getenv("MYSQL_DATABASE")}
	mdb.Test()
}
