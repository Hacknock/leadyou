module Hacknock/leadyou

go 1.18

replace Hacknock/logger => ./packages/appTier/logger

replace Hacknock/monitor => ./packages/dataTier/monitor

replace Hacknock/recorder => ./packages/dataTier/recorder

replace Hacknock/database => ./packages/dataTier/database

replace Hacknock/structure => ./packages/structure

replace Hacknock/github => ./packages/dataTier/github

replace Hacknock/repository => ./packages/appTier/repository

require (
	Hacknock/database v0.0.0-00010101000000-000000000000
	Hacknock/github v0.0.0-00010101000000-000000000000
	Hacknock/logger v0.0.0-00010101000000-000000000000
	Hacknock/monitor v0.0.0-00010101000000-000000000000
	Hacknock/repository v0.0.0-00010101000000-000000000000
	Hacknock/structure v0.0.0-00010101000000-000000000000
	github.com/go-chi/chi/v5 v5.0.7
)

require (
	Hacknock/recorder v0.0.0-00010101000000-000000000000 // indirect
	github.com/mattn/go-sqlite3 v1.14.14 // indirect
)
