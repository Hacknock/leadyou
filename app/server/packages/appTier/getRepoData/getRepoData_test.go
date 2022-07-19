package getRepoData

import "testing"

func TestGetCount(t *testing.T) {
	getRD := GetRepoData{}
	num, err := getRD.GetCount()

	if err != nil || num != 3 {
		t.Fatal(err)
	}
}
