module Hacknock/leadyou

go 1.18

replace Hacknock/recordLog => ./src/appTier/recordLog

replace Hacknock/monitorMemory => ./src/dataTier/monitorMemory

replace Hacknock/recordLine => ./src/dataTier/recordLine/

require (
	Hacknock/gitHubAPI v0.0.0-00010101000000-000000000000
	Hacknock/mDB v0.0.0-00010101000000-000000000000
	Hacknock/monitorMemory v0.0.0-00010101000000-000000000000
	Hacknock/recordLog v0.0.0-00010101000000-000000000000
	Hacknock/typeName v0.0.0-00010101000000-000000000000
)

require (
	Hacknock/recordLine v0.0.0-00010101000000-000000000000 // indirect
	github.com/go-sql-driver/mysql v1.6.0 // indirect
)

replace Hacknock/mDB => ./src/dataTier/mDB

replace Hacknock/typeName => ./src/typeName

replace Hacknock/gitHubAPI => ./src/dataTier/gitHubAPI
