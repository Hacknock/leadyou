package monitor

import (
	"bufio"
	"os"
	"strings"
	"testing"
	"time"
)

func TestMonitorMemoryBothOut(t *testing.T) {
	// Get the current time
	now := time.Now().Format(time.RFC3339)

	m := Monitor{Path: "./memory", FileName: "loga.txt"}
	rec, consoleOut, err := m.RecMemory(true, true)

	// The message line
	l := "[" + now + "][Memory] - "
	if !strings.HasPrefix(rec, l) || consoleOut == false || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, err := os.Open(m.Path + "/" + m.FileName)
	if err != nil {
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
				"Expected: " + rec + "\n" +
				"Actual: " + line)
		}
	}
}

func TestMonitorMemoryConsoleOut(t *testing.T) {
	// Get the current time
	now := time.Now().Format(time.RFC3339)

	m := Monitor{Path: "./memory/log", FileName: "loga.txt"}
	rec, consoleOut, err := m.RecMemory(true, false)

	// The message line
	l := "[" + now + "][Memory] - "
	if !strings.HasPrefix(rec, l) || consoleOut == false || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, err := os.Open(m.Path + "/" + m.FileName)
	if err == nil {
		t.Fatal("This file should not be.")
	}
	defer file.Close()
}

func TestMonitorMemoryFileOut(t *testing.T) {
	// Get the current time
	now := time.Now().Format(time.RFC3339)

	rm := Monitor{Path: "./memory/hoge", FileName: "loga.txt"}
	rec, consoleOut, err := rm.RecMemory(false, true)

	// The message line
	l := "[" + now + "][Memory] - "
	if !strings.HasPrefix(rec, l) || consoleOut == true || err != nil {
		t.Fatal("TestMonitorMemoryConsole is failed.")
	}

	// File open to check the written lines by recordLine.Error()
	file, err := os.Open(rm.Path + "/" + rm.FileName)
	if err != nil {
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
				"Expected: " + rec + "\n" +
				"Actual: " + line)
		}
	}
}
