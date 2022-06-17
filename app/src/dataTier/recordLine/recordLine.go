package recordLine

import (
	"log"
	"os"
	"time"
)

type RecordLine struct {
	Path      string
	File_name string
}

func (r RecordLine) Record(cate string, mess string, to_console bool, to_file bool) (rec string, err error) {

	// Get the current time
	t := time.Now()
	time_data := t.Format(time.RFC3339)

	// The message line
	mess_line := "[" + time_data + "][" + cate + "] - " + mess

	if to_file {
		// Check the existing of directory
		if _, err := os.Stat(r.Path); os.IsNotExist(err) {
			os.Mkdir(r.Path, 0777)
		} else if err != nil {
			return "", err
		}

		// File open or create
		f, err := os.OpenFile(r.Path+"/"+r.File_name, os.O_CREATE|os.O_RDWR|os.O_APPEND, 0600)
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
	}

	if to_console {
		// To output the log to terminal
		log.Println(mess_line)
	}

	return mess_line, nil
}
