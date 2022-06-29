package gitHubAPI

import (
	"Hacknock/typeName"
	"fmt"
	"os"
	"testing"
)

func TestFetchReadme(t *testing.T) {
	ghAPI := GitHubAPI{token: os.Getenv("GITHUB_TOKEN")}
	param := typeName.WhereParams{Owner: "Hacknock", Repo: "environments-share"}
	res, err := ghAPI.FetchReadme(param)
	if err != nil {
		t.Fatal("FetchReadme throw an error")
	}

	fmt.Println("🐬")
	fmt.Println(ghAPI.token)

	if res != "main" {
		t.Fatal("The default branch is not matched.")
	}
}
