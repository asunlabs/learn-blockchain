//go:build integration
// +build integration

package file_test

import (
	"fmt"
	"testing"
)

func TestWow(t *testing.T) {
	isTrue := true
	if isTrue != true {
		t.Fail()
	}
	fmt.Println("integ passed")
}
