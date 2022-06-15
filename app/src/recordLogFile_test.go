package recordLogFile

import (
	"bufio"
	"os"
	"strconv"
	"testing"
	"time"
)

func TestTemp(t *testing.T) {
	// Category
	cate := "Error"
	// Get the present time
	tim := time.Now()

	// Initialize recordLogFile
	recordLogFile := RecordLogFile{0, "./testg", "loga.txt"}

	// Make the arguments
	mess := []string{"Hello World", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"]["+cate+"] - "+mess[i])
		rec, err := recordLogFile.temp(tim.Format(time.RFC3339), cate, mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLogFile.Error()
	file, er := os.Open(recordLogFile.path + "/" + recordLogFile.file_name)
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

func TestError(t *testing.T) {
	// Get the present time
	tim := time.Now()

	// Initialize recordLogFile
	recordLogFile := RecordLogFile{0, "./test", "log.txt"}

	// Make the arguments
	mess := []string{"Hello", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Error] - "+mess[i])
		rec, err := recordLogFile.Error(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLogFile.Error()
	file, er := os.Open(recordLogFile.path + "/" + recordLogFile.file_name)
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

	// Initialize recordLogFile
	recordLogFile := RecordLogFile{0, "./test/aaa", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Warn] - "+mess[i])
		rec, err := recordLogFile.Warn(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLogFile.Warn()
	file, er := os.Open(recordLogFile.path + "/" + recordLogFile.file_name)
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

	// Initialize recordLogFile
	recordLogFile := RecordLogFile{0, "./test/aaa/bbb", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test", "Testing"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Log] - "+mess[i])
		rec, err := recordLogFile.Log(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLogFile.Log()
	file, er := os.Open(recordLogFile.path + "/" + recordLogFile.file_name)
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

	// Initialize recordLogFile
	recordLogFile := RecordLogFile{0, "./test/aaa/bbb/ccc", "log.txt"}

	// Make the arguments
	mess := []string{"Good night", "This is a test", "Testing", "Cat"}
	var expects []string
	for i := 0; i < len(mess); i++ {
		expects = append(expects, "["+tim.Format(time.RFC3339)+"][Debug] - "+mess[i])
		rec, err := recordLogFile.Debug(mess[i])

		// Check the return
		if rec != expects[i] || err != nil {
			t.Fatal("Does not much record or err exists.")
		}
	}

	// File open to check the written lines by recordLogFile.Debug()
	file, er := os.Open(recordLogFile.path + "/" + recordLogFile.file_name)
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

	// Initialize recordLogFile0, All logs output
	recordLogFile0 := RecordLogFile{0, "./test", "log0.txt"}
	_, err := recordLogFile0.Debug(mess[0])
	if err != nil {
		t.Fatal("recordLogFile0.Debug throws error but it should not throw it.")
	}
	_, err = recordLogFile0.Log(mess[1])
	if err != nil {
		t.Fatal("recordLogFile0.Log throws error but it should not throw it.")
	}
	_, err = recordLogFile0.Warn(mess[2])
	if err != nil {
		t.Fatal("recordLogFile0.Warn throws error but it should not throw it.")
	}
	_, err = recordLogFile0.Error(mess[3])
	if err != nil {
		t.Fatal("recordLogFile0.Error throws error but it should not throw it.")
	}

	// Initialize recordLogFile1, logs except for Debug
	recordLogFile1 := RecordLogFile{1, "./test", "log1.txt"}
	_, err = recordLogFile1.Debug(mess[0])
	if err == nil {
		t.Fatal("recordLogFile1.Debug does not throw error but it should throw it.")
	}
	_, err = recordLogFile1.Log(mess[1])
	if err != nil {
		t.Fatal("recordLogFile1.Log throws error but it should not throw it.")
	}
	_, err = recordLogFile1.Warn(mess[2])
	if err != nil {
		t.Fatal("recordLogFile1.Warn throws error but it should not throw it.")
	}
	_, err = recordLogFile1.Error(mess[3])
	if err != nil {
		t.Fatal("recordLogFile1.Error throws error but it should not throw it.")
	}

	// Initialize recordLogFile1, output Warn and Error
	recordLogFile2 := RecordLogFile{2, "./test", "log2.txt"}
	_, err = recordLogFile2.Debug(mess[0])
	if err == nil {
		t.Fatal("recordLogFile2.Debug does not throw error but it should throw it.")
	}
	_, err = recordLogFile2.Log(mess[1])
	if err == nil {
		t.Fatal("recordLogFile2.Log does not throw error but it should throw it.")
	}
	_, err = recordLogFile2.Warn(mess[2])
	if err != nil {
		t.Fatal("recordLogFile2.Warn throws error but it should not throw it.")
	}
	_, err = recordLogFile2.Error(mess[3])
	if err != nil {
		t.Fatal("recordLogFile2.Error throws error but it should not throw it.")
	}

	// Initialize recordLogFile1, output Warn and Error
	recordLogFile3 := RecordLogFile{3, "./test", "log3.txt"}
	_, err = recordLogFile3.Debug(mess[0])
	if err == nil {
		t.Fatal("recordLogFile3.Debug does not throw error but it should throw it.")
	}
	_, err = recordLogFile3.Log(mess[1])
	if err == nil {
		t.Fatal("recordLogFile3.Log does not throw error but it should throw it.")
	}
	_, err = recordLogFile3.Warn(mess[2])
	if err == nil {
		t.Fatal("recordLogFile3.Warn does not throw error but it should throw it.")
	}
	_, err = recordLogFile3.Error(mess[3])
	if err != nil {
		t.Fatal("recordLogFile3.Error throws error but it should not throw it.")
	}
}
