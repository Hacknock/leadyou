package recordLogFile

import (
	"errors"
	"log"
	"os"
	"time"
)

type RecordLogFile struct {
	level     int
	path      string
	file_name string
}

// The template function to record and output a log line
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

// The function to record Error to file.
func (r RecordLogFile) Error(mess string) (rec string, err error) {

	// Get the current time
	t := time.Now()

	// Write the line and output it to stdout
	res, err := r.temp(t.Format(time.RFC3339), "Error", mess)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Warn to file.
func (r RecordLogFile) Warn(mess string) (rec string, err error) {

	if r.level >= 3 {
		return "", errors.New("This method will record and output Warn less than 2.")
	}

	// Get the current time
	t := time.Now()

	// Write the line and output it to stdout
	res, err := r.temp(t.Format(time.RFC3339), "Warn", mess)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Log to file.
func (r RecordLogFile) Log(mess string) (rec string, err error) {

	if r.level >= 2 {
		return "", errors.New("This method will record and output Log less than 1.")
	}

	// Get the current time
	t := time.Now()

	// Write the line and output it to stdout
	res, err := r.temp(t.Format(time.RFC3339), "Log", mess)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Debug to file.
func (r RecordLogFile) Debug(mess string) (rec string, err error) {

	if r.level >= 1 {
		return "", errors.New("This method will record and output Log when level is 0.")
	}

	// Get the current time
	t := time.Now()

	// Write the line and output it to stdout
	res, err := r.temp(t.Format(time.RFC3339), "Debug", mess)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}
