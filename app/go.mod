module Hacknock/leadyou

go 1.18

replace Hacknock/recordLog => ./src/appTier/recordLog

replace Hacknock/monitorMemory => ./src/dataTier/monitorMemory

replace Hacknock/recordLine => ./src/dataTier/recordLine/

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
	github.com/golang-jwt/jwt v3.2.2+incompatible // indirect
	github.com/joho/godotenv v1.4.0 // indirect
	github.com/labstack/echo/v4 v4.9.0 // indirect
	github.com/labstack/gommon v0.4.0 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.16 // indirect
	github.com/mattn/go-sqlite3 v1.14.14 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasttemplate v1.2.1 // indirect
	golang.org/x/crypto v0.0.0-20221005025214-4161e89ecf1b // indirect
	golang.org/x/net v0.0.0-20221004154528-8021a29435af // indirect
	golang.org/x/sys v0.0.0-20221006211917-84dc82d7e875 // indirect
	golang.org/x/text v0.3.7 // indirect
	golang.org/x/time v0.0.0-20201208040808-7e3f01d25324 // indirect
)

replace Hacknock/mDB => ./src/dataTier/mDB

replace Hacknock/typeName => ./src/typeName

replace Hacknock/gitHubAPI => ./src/dataTier/gitHubAPI

replace Hacknock/getRepoData => ./src/appTier/getRepoData
