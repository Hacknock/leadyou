package logger

import (
	"Hacknock/recorder"
	"errors"
	"log"
)

type RecordLog struct {
	Level    int
	Path     string
	FileName string
}

// The function to record Error to file.
func (r RecordLog) Error(mess string) (string, error) {
	// record function instance
	recordL := recorder.Recorder{Path: r.Path, FileName: r.FileName}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Error", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Warn to file.
func (r RecordLog) Warn(mess string) (string, error) {

	if r.Level >= 3 {
		return "", errors.New("this method will record and output Warn less than 2")
	}

	// record function instance
	recordL := recorder.Recorder{Path: r.Path, FileName: r.FileName}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Warn", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Log to file.
func (r RecordLog) Log(mess string) (string, error) {

	if r.Level >= 2 {
		return "", errors.New("this method will record and output Log less than 1")
	}

	// record function instance
	recordL := recorder.Recorder{Path: r.Path, FileName: r.FileName}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Log", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Debug to file.
func (r RecordLog) Debug(mess string) (string, error) {

	if r.Level >= 1 {
		return "", errors.New("this method will record and output Log when level is 0")
	}

	// record function instance
	recordL := recorder.Recorder{Path: r.Path, FileName: r.FileName}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Debug", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}
