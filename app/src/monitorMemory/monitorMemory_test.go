package monitorMemory

import "testing"

func TestSample(t *testing.T) {
	ans := sample(2)
	if ans != 2*2 {
		t.Fatal("🐬")
	}
}
