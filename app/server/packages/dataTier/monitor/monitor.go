package monitor

import (
	"Hacknock/recorder"
	"strconv"

	"runtime"
)

type Monitor struct {
	Path     string
	FileName string
}

func (m Monitor) RecMemory(toConsole bool, toFile bool) (string, bool, error) {

	recordL := recorder.Recorder{Path: m.Path, FileName: m.FileName}

	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)
	memVal := m.toKb(ms.Sys)

	return recordL.Record("Memory", strconv.FormatUint(memVal, 10)+" KB", toConsole, toFile)
}

func (m Monitor) toKb(bytes uint64) uint64 {
	return bytes / 1024
}
