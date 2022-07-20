package recorder

import (
	"log"
	"os"
	"time"
)

type Recorder struct {
	Path     string
	FileName string
}

func (r Recorder) Record(cate string, mess string, toConsole bool, toFile bool) (string, bool, error) {

	// Variable console out log
	isConsole := false

	// Get the current time
	t := time.Now()
	timeData := t.Format(time.RFC3339)

	// The message line
	messLine := "[" + timeData + "][" + cate + "] - " + mess

	if toFile {
		// Check the existing of directory
		_, err := os.Stat(r.Path)
		if os.IsNotExist(err) {
			os.Mkdir(r.Path, 0777)
		} else if err != nil {
			return "", isConsole, err
		}

		// File open or create
		p := r.Path + "/" + r.FileName             // path to save the file
		o := os.O_CREATE | os.O_RDWR | os.O_APPEND // option to save data to the file
		f, err := os.OpenFile(p, o, 0600)
		if err != nil {
			log.Fatal(err)
			return "", isConsole, err
		}
		defer f.Close()

		// Write error line
		_, er := f.WriteString(messLine + "\n")
		if er != nil {
			log.Fatal(er)
			return "", isConsole, er
		}
	}

	if toConsole {
		// To output the log to terminal
		log.Println(messLine)
		isConsole = true
	}

	return messLine, isConsole, nil
}
