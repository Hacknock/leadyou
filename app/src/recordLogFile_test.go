package recordLogFile

import (
	"testing"
	"time"
	"os"
	"bufio"
)

func TestRecordLogFile(t *testing.T) {
	mess := "Hello"
	tim := time.Now()
	recordLogFile := RecordLogFile{0, "test/test"}
	rec, err := recordLogFile.Error(mess)
	if rec != "[" + tim.Format(time.RFC3339) + "][Error] - " + mess || err != nil {
		t.Fatal("Does not much record or err exists.")
	}

	file, er := os.Open("test.txt")
	if er != nil {
		t.Fatal("Fail to open the file. test.txt")
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	var line string

	for scanner.Scan() {
		line = scanner.Text()
	}

	if erro:= scanner.Err(); erro != nil {
		t.Fatal("Sccaner Error.")
	}
	if line != "[" + tim.Format(time.RFC3339) + "][Error] - " + mess {
		t.Fatal("No match written line.")
	}
}
