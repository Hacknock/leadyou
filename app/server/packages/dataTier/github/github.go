package github

import (
	"Hacknock/structure"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type Github struct {
	Token string
}

func (g Github) FetchReadme(p structure.WhereParams) (string, error) {

	ru := "https://api.github.com/repos/" + p.Owner + "/" + p.Repo + "/readme" // Request-URL
	req, err := http.NewRequest("GET", ru, nil)
	if err != nil {
		return "", err
	}

	t := `token ` + g.Token
	req.Header.Add("Content-Type", "application/json; charset=utf-8")
	req.Header.Add("Authorization", t)
	req.Header.Set("Access-Control-Allow-Origin", "https://api.github.com")
	req.Header.Set("Access-Control-Allow-Credentials", "true")
	req.Header.Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Origin, X-Csrftoken, Accept, Cookie")
	req.Header.Set("Access-Control-Allow-Methods", "GET")

	client := new(http.Client)
	res, err := client.Do(req)

	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)

	if err != nil {
		return "", err
	}

	type JSONTemp struct {
		URL string `json:"download_url"`
	}

	var tmp JSONTemp

	err = json.Unmarshal(body, &tmp)
	if err != nil {
		return "", err
	}

	var val string
	if len(tmp.URL) == 0 {
		val = ""
	} else {
		spl := strings.Split(tmp.URL, "/")
		val = spl[len(spl)-2]
	}

	return val, nil
}
