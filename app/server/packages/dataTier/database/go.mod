module Hacknock/database

go 1.18

replace Hacknock/structure => ../../structure

require (
	Hacknock/structure v0.0.0-00010101000000-000000000000
	github.com/mattn/go-sqlite3 v1.14.14
)
