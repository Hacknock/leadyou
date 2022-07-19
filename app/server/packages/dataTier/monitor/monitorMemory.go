package monitor

import (
	"Hacknock/recorder"
	"strconv"

	"runtime"
)

type MonitorMemory struct {
	Path      string
	File_name string
}

func (m MonitorMemory) RecMemory(to_console bool, to_file bool) (rec string, console_out bool, err error) {

	recordL := recorder.RecordLine{Path: m.Path, File_name: m.File_name}

	var (
		ms runtime.MemStats
	)
	runtime.ReadMemStats(&ms)
	memVal := m.toKb(ms.Sys)

	return recordL.Record("Memory", strconv.FormatUint(memVal, 10)+" KB", to_console, to_file)
}

func (m MonitorMemory) toKb(bytes uint64) uint64 {
	return bytes / 1024
}
