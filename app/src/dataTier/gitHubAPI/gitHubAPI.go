package gitHubAPI

import "Hacknock/typeName"

type GitHubAPI struct {
	token string
}

func (g GitHubAPI) FetchReadme(p typeName.WhereParams) (string, error) {
	return "main", nil
}
