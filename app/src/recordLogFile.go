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

func (r RecordLogFile) temp(time_data string, cate string, mess string) (rec string, err error) {
	// The message line
	mess_line := "[" + time_data + "][" + cate + "] - " + mess
	// Check the existing of directory
	if _, err := os.Stat(r.path); os.IsNotExist(err) {
		os.Mkdir(r.path, 0777)
	} else if err != nil {
		return "", err
	}

	// File open or create
	f, err := os.OpenFile(r.path+"/"+r.file_name, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0600)
	if err != nil {
		log.Fatal(err)
		return "", err
	}
	defer f.Close()

	// Write error line
	_, er := f.WriteString(mess_line + "\n")
	if er != nil {
		log.Fatal(er)
		return "", er
	}

	// To output the log to terminal
	log.Println(mess_line)
	return mess_line, nil
}

// The function to record logs to file.
func (r RecordLogFile) Error(mess string) (rec string, err error) {
	t := time.Now()
	res, err := r.temp(t.Format(time.RFC3339), "Error", mess)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}
