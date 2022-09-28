// +build unit
package file_test

import (
	file "fiber-app/feature/data"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestReadFile(t *testing.T) {
	text := file.ReadFile()

	if len(text) == 0 {
		t.Fail()
	}
}

func TestHttpRequest(t *testing.T) {
	handler := func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "lol")
	}

	req := httptest.NewRequest("GET", "https://jsonplaceholder.typicode.com/users", nil)
	w := httptest.NewRecorder()

	handler(w, req)

	response := w.Result()
	body, _ := io.ReadAll(response.Body)

	fmt.Println(string(body))

	if response.StatusCode != 200 {
		t.Fail()
	}
}
