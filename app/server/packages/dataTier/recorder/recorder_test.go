package recorder

import (
	"bufio"
	"os"
	"strconv"
	"testing"
	"time"
)

func TestRecordBothOut(t *testing.T) {
	// Category
	cate := "Error"
	// Get the current time
	now := time.Now()

	// Initialize recordLine
	recordLine := Recorder{Path: "./testg", FileName: "logabc.txt"}

	// Make the arguments
	mess := []string{"Hello World", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		e := "[" + now.Format(time.RFC3339) + "][" + cate + "] - " + mess[i] // the expected message line
		expects = append(expects, e)
		rec, isConsole, err := recordLine.Record(cate, mess[i], true, true)

		// Check the return
		if rec != expects[i] || err != nil || isConsole == false {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLine.Error()
	file, err := os.Open(recordLine.Path + "/" + recordLine.FileName)
	if err != nil {
		t.Fatal("Fail to open the file. test.txt")
	}
	defer file.Close()

	// Set scanner to read lines on the file
	scanner := bufio.NewScanner(file)

	// Make variable to count lines
	l := 0
	for scanner.Scan() {
		line := scanner.Text()
		if line != expects[l] {
			t.Fatal("Not matched line " + strconv.Itoa(l) + ".\n" +
				"Expected: " + expects[l] + "\n" +
				"Actual: " + line)
		}
		l++
	}
}

func TestRecordOnlyFileOut(t *testing.T) {
	// Category
	cate := "Error"
	// Get the present time
	now := time.Now()

	// Initialize recordLine
	recordLine := Recorder{Path: "./testg", FileName: "logcba.txt"}

	// Make the arguments
	mess := []string{"Hello World", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		e := "[" + now.Format(time.RFC3339) + "][" + cate + "] - " + mess[i]
		expects = append(expects, e)
		rec, isConsole, err := recordLine.Record(cate, mess[i], false, true)

		// Check the return
		if rec != expects[i] || err != nil || isConsole == true {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLine.Error()
	file, err := os.Open(recordLine.Path + "/" + recordLine.FileName)
	if err != nil {
		t.Fatal("Fail to open the file. test.txt")
	}
	defer file.Close()

	// Set scanner to read lines on the file
	scanner := bufio.NewScanner(file)

	// Make variable to count lines
	l := 0
	for scanner.Scan() {
		line := scanner.Text()
		if line != expects[l] {
			t.Fatal("Not matched line " + strconv.Itoa(l) + ".\n" +
				"Expected: " + expects[l] + "\n" +
				"Actual: " + line)
		}
		l++
	}
}

func TestRecordOnlyConsoleOut(t *testing.T) {
	// Category
	cate := "Error"
	// Get the present time
	now := time.Now()

	// Initialize recordLine
	recordLine := Recorder{Path: "./testg", FileName: "logc.txt"}

	// Make the arguments
	mess := []string{"Hello World", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		e := "[" + now.Format(time.RFC3339) + "][" + cate + "] - " + mess[i]
		expects = append(expects, e)
		rec, isConsole, err := recordLine.Record(cate, mess[i], true, false)

		// Check the return
		if rec != expects[i] || err != nil || isConsole == false {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLine.Error()
	file, er := os.Open(recordLine.Path + "/" + recordLine.FileName)
	if er == nil {
		t.Fatal("This file should not exist")
	}
	defer file.Close()
}
