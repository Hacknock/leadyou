package recordLogFile

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
