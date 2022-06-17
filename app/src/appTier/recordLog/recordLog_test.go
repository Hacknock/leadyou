package recordLog

import (
	"bufio"
	"os"
	"strconv"
	"testing"
	"time"
)

func TestError(t *testing.T) {
	// Get the present time
	tim := time.Now()

	// Initialize recordLog
	recordLog := RecordLog{0, "./test", "log.txt"}

	// Make the arguments
	mess := []string{"Hello", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Error] - "+mess[i])
		rec, err := recordLog.Error(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLog.Error()
	file, er := os.Open(recordLog.Path + "/" + recordLog.File_name)
	if er != nil {
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
				"Expected: " + expects[l] +
				"\nActual: " + line)
		}
		l++
	}
}

func TestWarn(t *testing.T) {
	// Get the present time
	tim := time.Now()

	// Initialize recordLog
	recordLog := RecordLog{0, "./test/aaa", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Warn] - "+mess[i])
		rec, err := recordLog.Warn(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLog.Warn()
	file, er := os.Open(recordLog.Path + "/" + recordLog.File_name)
	if er != nil {
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
				"Expected: " + expects[l] +
				"\nActual: " + line)
		}
		l++
	}
}

func TestLog(t *testing.T) {
	// Get the present time
	tim := time.Now()

	// Initialize recordLog
	recordLog := RecordLog{0, "./test/aaa/bbb", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test", "Testing"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Log] - "+mess[i])
		rec, err := recordLog.Log(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLog.Log()
	file, er := os.Open(recordLog.Path + "/" + recordLog.File_name)
	if er != nil {
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
				"Expected: " + expects[l] +
				"\nActual: " + line)
		}
		l++
	}
}

func TestDebug(t *testing.T) {
	// Get the present time
	tim := time.Now()

	// Initialize recordLog
	recordLog := RecordLog{0, "./test/aaa/bbb/ccc", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test", "Testing", "Cat"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Debug] - "+mess[i])
		rec, err := recordLog.Debug(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLog.Debug()
	file, er := os.Open(recordLog.Path + "/" + recordLog.File_name)
	if er != nil {
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
				"Expected: " + expects[l] +
				"\nActual: " + line)
		}
		l++
	}
}

func TestOutputLevel(t *testing.T) {

	// Message List
	mess := []string{"Good night", "This is a test", "Testing", "Cat🐱"}

	for i := 0; i < 4; i++ {
		recordLog := RecordLog{i, "./test", "log.txt"}
		_, errDebug := recordLog.Debug(mess[0])
		_, errLog := recordLog.Log(mess[1])
		_, errWarn := recordLog.Warn(mess[2])
		_, errError := recordLog.Error(mess[3])

		if i == 0 {
			if errDebug != nil || errLog != nil || errWarn != nil || errError != nil {
				t.Fatal("Error handling is failed on level 0.")
			}
		} else if i == 1 {
			if errDebug == nil || errLog != nil || errWarn != nil || errError != nil {
				t.Fatal("Error handling is failed on level 1.")
			}
		} else if i == 2 {
			if errDebug == nil || errLog == nil || errWarn != nil || errError != nil {
				t.Fatal("Error handling is failed on level 2.")
			}
		} else if i == 3 {
			if errDebug == nil || errLog == nil || errWarn == nil || errError != nil {
				t.Fatal("Error handling is failed on level 3.")
			}
		}
	}
}
