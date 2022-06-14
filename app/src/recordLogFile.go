package recordLogFile

import (
	"log"
	"os"
	"time"
)

type RecordLogFile struct {
	level     int
	path      string
	file_name string
}

// The function to record logs to file.
func (r RecordLogFile) Error(mess string) (rec string, err error) {
	t := time.Now()

	// Check the existing of directory
	if _, err := os.Stat(r.path); os.IsNotExist(err) {
		os.Mkdir(r.path, 0777)
	}

	// File open or create
	f, err := os.OpenFile(r.path+"/"+r.file_name, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0600)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Write error line
	_, er := f.WriteString("[" + t.Format(time.RFC3339) + "][Error] - " + mess + "\n")
	if er != nil {
		log.Fatal(er)
	}

	log.Println("[" + t.Format(time.RFC3339) + "][Error] - " + mess)
	return "[" + t.Format(time.RFC3339) + "][Error] - " + mess, nil
}
