package recordLogFile

import (
	"log"
	"time"
	"os"
)

type RecordLogFile struct {
	level int
	path string
	}

// The function to record logs to file.
func (r RecordLogFile) Error(mess string) (rec string, err error) {
	t := time.Now()

	// File open or create
	f, err := os.OpenFile("test.txt", os.O_CREATE|os.O_RDWR|os.O_APPEND, 0600)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Write error line
	_, er := f.WriteString("[" + t.Format(time.RFC3339) + "][Error] - " + mess)
	if er != nil {
		log.Fatal(er)
	}

	log.Println("[" + t.Format(time.RFC3339) + "][Error] - " + mess)
	return "[" + t.Format(time.RFC3339) + "][Error] - " + mess, nil
}
