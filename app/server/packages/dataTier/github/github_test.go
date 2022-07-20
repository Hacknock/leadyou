package github

import (
	"Hacknock/structure"
	"os"
	"testing"
)

func TestFetchReadme(t *testing.T) {
	ghAPI := Github{Token: os.Getenv("GITHUB_TOKEN")}
	param := structure.WhereParams{Owner: "Hacknock", Repo: "leadyou"}
	res, err := ghAPI.FetchReadme(param)
	if err != nil {
		t.Fatal("FetchReadme throw an error")
	}

	if res != "develop" {
		t.Fatal("The default branch is not matched.")
	}

	param = structure.WhereParams{Owner: "Hacknock", Repo: "environments-share"}
	res, _ = ghAPI.FetchReadme(param)

	if res != "" {
		t.Fatal("This return must throw an error.")
	}
}
