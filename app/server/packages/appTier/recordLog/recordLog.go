package recordLog

import (
	"Hacknock/recordLine"
	"errors"
	"log"
)

type RecordLog struct {
	Level     int
	Path      string
	File_name string
}

// The function to record Error to file.
func (r RecordLog) Error(mess string) (rec string, err error) {
	// record function instance
	recordL := recordLine.RecordLine{Path: r.Path, File_name: r.File_name}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Error", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Warn to file.
func (r RecordLog) Warn(mess string) (rec string, err error) {

	if r.Level >= 3 {
		return "", errors.New("This method will record and output Warn less than 2.")
	}

	// record function instance
	recordL := recordLine.RecordLine{Path: r.Path, File_name: r.File_name}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Warn", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Log to file.
func (r RecordLog) Log(mess string) (rec string, err error) {

	if r.Level >= 2 {
		return "", errors.New("This method will record and output Log less than 1.")
	}

	// record function instance
	recordL := recordLine.RecordLine{Path: r.Path, File_name: r.File_name}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Log", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}

// The function to record Debug to file.
func (r RecordLog) Debug(mess string) (rec string, err error) {

	if r.Level >= 1 {
		return "", errors.New("This method will record and output Log when level is 0.")
	}

	// record function instance
	recordL := recordLine.RecordLine{Path: r.Path, File_name: r.File_name}

	// Write the line and output it to stdout
	res, _, err := recordL.Record("Debug", mess, true, true)
	if err != nil {
		log.Fatal(err)
		return "", err
	}

	return res, nil
}
