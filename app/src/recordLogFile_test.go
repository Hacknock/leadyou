package recordLogFile

import (
	"testing"
)

func TestRecordLogFile(t *testing.T) {
	rec, err := RecordLogFile("Hello")
	if rec != "[2022-06-13 19:52][Error] - Hello" || err != nil {
		t.Fatal("Does not much record or err exists.")
	}
}
