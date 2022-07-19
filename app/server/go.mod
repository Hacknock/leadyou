module Hacknock/leadyou

go 1.18

replace Hacknock/recordLog => ./packages/appTier/recordLog

replace Hacknock/monitorMemory => ./packages/dataTier/monitorMemory

replace Hacknock/recordLine => ./packages/dataTier/recordLine

replace Hacknock/mDB => ./packages/dataTier/mDB

replace Hacknock/typeName => ./packages/typeName

require (
	Hacknock/getRepoData v0.0.0-00010101000000-000000000000
	Hacknock/gitHubAPI v0.0.0-00010101000000-000000000000
	Hacknock/mDB v0.0.0-00010101000000-000000000000
	Hacknock/monitorMemory v0.0.0-00010101000000-000000000000
	Hacknock/recordLog v0.0.0-00010101000000-000000000000
	Hacknock/typeName v0.0.0-00010101000000-000000000000
)

require (
	Hacknock/recordLine v0.0.0-00010101000000-000000000000 // indirect
	github.com/mattn/go-sqlite3 v1.14.14 // indirect
)

replace Hacknock/gitHubAPI => ./packages/dataTier/gitHubAPI

replace Hacknock/getRepoData => ./packages/appTier/getRepoData
