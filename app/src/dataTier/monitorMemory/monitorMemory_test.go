package monitorMemory

import (
	"bufio"
	"log"
	"os"
	"strings"
	"testing"
	"time"
)

func TestMonitorMemoryBothOut(t *testing.T) {
	// Get the current time
	tim := time.Now()
	time_data := tim.Format(time.RFC3339)

	// The message line
	mess_line := "[" + time_data + "][Memory] - "

	rm := MonitorMemory{Path: "./memory", File_name: "loga.txt"}
	rec, console_out, err := rm.recMemory(true, true)

	if !strings.HasPrefix(rec, mess_line) || console_out == false || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, er := os.Open(rm.Path + "/" + rm.File_name)
	if er != nil {
		t.Fatal("Fail to open the file. test.txt")
	}
	defer file.Close()

	// Set scanner to read lines on the file
	scanner := bufio.NewScanner(file)
	// Make variable to count lines
	for scanner.Scan() {
		line := scanner.Text()
		if line != rec {
			t.Fatal("Not matched line.\n" +
				"Expected: " + rec +
				"\nActual: " + line)
		}
	}
}

func TestMonitorMemoryConsoleOut(t *testing.T) {
	// Get the current time
	tim := time.Now()
	time_data := tim.Format(time.RFC3339)

	// The message line
	mess_line := "[" + time_data + "][Memory] - "

	rm := MonitorMemory{Path: "./memory/log", File_name: "loga.txt"}
	rec, console_out, err := rm.recMemory(true, false)

	if !strings.HasPrefix(rec, mess_line) || console_out == false || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, er := os.Open(rm.Path + "/" + rm.File_name)
	if er == nil {
		t.Fatal("This file should not be.")
	}
	defer file.Close()
}

func TestMonitorMemoryFileOut(t *testing.T) {
	// Get the current time
	tim := time.Now()
	time_data := tim.Format(time.RFC3339)

	// The message line
	mess_line := "[" + time_data + "][Memory] - "

	rm := MonitorMemory{Path: "./memory/hoge", File_name: "loga.txt"}
	rec, console_out, err := rm.recMemory(false, true)

	if !strings.HasPrefix(rec, mess_line) || console_out == true || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, er := os.Open(rm.Path + "/" + rm.File_name)
	if er != nil {
		t.Fatal("Fail to open the file. test.txt")
	}
	defer file.Close()

	// Set scanner to read lines on the file
	scanner := bufio.NewScanner(file)
	// Make variable to count lines
	for scanner.Scan() {
		line := scanner.Text()
		if line != rec {
			t.Fatal("Not matched line.\n" +
				"Expected: " + rec +
				"\nActual: " + line)
		}
	}
}
