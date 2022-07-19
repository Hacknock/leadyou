package gitHubAPI

import (
	"Hacknock/structure"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type GitHubAPI struct {
	token string
}

func (g GitHubAPI) FetchReadme(p structure.WhereParams) (string, error) {
	requestURL := "https://api.github.com/repos/" + p.Owner + "/" + p.Repo + "/readme"

	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		return "", err
	}

	req.Header.Add("Content-Type", "application/json; charset=utf-8")
	req.Header.Add("Authorization", `token `+g.token)
	req.Header.Set("Access-Control-Allow-Origin", "https://api.github.com")
	req.Header.Set("Access-Control-Allow-Credentials", "true")
	req.Header.Set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Origin, X-Csrftoken, Accept, Cookie")
	req.Header.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")

	client := new(http.Client)
	resp, err := client.Do(req)

	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

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
