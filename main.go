// Copyright 2017 The go-github AUTHORS. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// The simple command demonstrates a simple functionality which
// prompts the user for a GitHub username and lists all the public
// organization memberships of the specified username.
package main

import (
	"context"
	"fmt"
	"github.com/google/go-github/github"
	"net/http"
	"io/ioutil"
)

// Fetch all the public organizations' membership of a user.
//
func FetchOrganizations(username string) ([]*github.Organization, error) {
	client := github.NewClient(nil)
	orgs, _, err := client.Organizations.List(context.Background(), username, nil)
	return orgs, err
}

// Get repository list
func  getRepositoryList(username string)  ([]*github.Repository, error){
	ctx := context.Background()
	client := github.NewClient(nil)
	opt := &github.RepositoryListByOrgOptions{Type: "public"}
	repos, _, err := client.Repositories.ListByOrg(ctx, "pullreq-me", opt)
	return repos, err
}

// Get Fork list
func getForkList(username string) ([]*github.Repository, error)  {
	ctx := context.Background()
	client := github.NewClient(nil)
	opt := &github.RepositoryListForksOptions{Sort:"newest"}
	repos, _, err := client.Repositories.ListForks(ctx, "pullreq-me", "portfolio", opt)
	return  repos, err
}

func main() {
	var username string
	fmt.Print("Enter GitHub username: ")
	fmt.Scanf("%s", &username)

	repof, err := getForkList("test")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	for k, repof := range  repof {
		fmt.Printf("%v, %v\n", k + 1, *repof.HTMLURL)

		url := "https://raw.githubusercontent.com/KASHIHARAAkira/portfolio/master/README.md"

		resp, _ := http.Get(url)
		defer resp.Body.Close()

		byteArray, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(byteArray)) // htmlをstringで取得
	}

	//repo, err := getRepositoryList("pullre1-me")
	//if err != nil {
	//	fmt.Printf("Error: %v\n", err)
	//	return
	//}
	//
	//for j, repo := range repo {
	//	fmt.Printf("%v, %v\n", j + 1, repo)
	//}
	//
	//organizations, err := FetchOrganizations(username)
	//if err != nil {
	//	fmt.Printf("Error: %v\n", err)
	//	return
	//}
	//
	//for i, organization := range organizations {
	//	fmt.Printf("%v. %v\n", i+1, organization.GetLogin())
	//}
}

