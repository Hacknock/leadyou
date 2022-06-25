module Hacknock/leadyou

go 1.18

replace Hacknock/recordLog => ./src/appTier/recordLog

replace Hacknock/monitorMemory => ./src/dataTier/monitorMemory

replace Hacknock/recordLine => ./src/dataTier/recordLine/

require (
	Hacknock/mDB v0.0.0-00010101000000-000000000000
	Hacknock/monitorMemory v0.0.0-00010101000000-000000000000
	Hacknock/recordLog v0.0.0-00010101000000-000000000000
)

require Hacknock/recordLine v0.0.0-00010101000000-000000000000 // indirect

replace Hacknock/mDB => ./src/dataTier/mDB
