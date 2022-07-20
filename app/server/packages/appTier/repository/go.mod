module Hacknock/repository

go 1.18

replace Hacknock/database => ../../dataTier/database

replace Hacknock/structure => ../../structure

require Hacknock/database v0.0.0-00010101000000-000000000000

require (
	Hacknock/structure v0.0.0-00010101000000-000000000000 // indirect
	github.com/mattn/go-sqlite3 v1.14.14 // indirect
)
