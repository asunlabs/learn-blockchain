package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAPIHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api", nil)

	// @dev NewRecorder is an implementation of ResponseWriter.
	w := httptest.NewRecorder()
	APIHandler(w, req)

	// get response object
	res := w.Result()
	defer res.Body.Close()

	// ReadAll reads from r until an error or EOF and returns the data it read
	data, err := io.ReadAll(res.Body)

	if err != nil {
		t.Error()
	}

	jsonTextData := `{"name":"jake"}`

	if string(data) != jsonTextData {
		log.Printf("byte to text: %s", string(data))
		t.Errorf("expected %s but got %v", jsonTextData, string(data))
	}
}

// create a fake server for test
func TestGetJobById(t *testing.T) {
	expected := fmt.Sprintf(`{"id":%d,"name":"developer"}`, 1)
	// create a mock server with mock handler
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(expected))
	}))

	defer server.Close()

	url := (server.URL+"/job/1")

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, url, nil)
	
	GetJobById(w, req)

	res := w.Result()
	defer res.Body.Close()

	data, _ := io.ReadAll(res.Body)

	if string(data) != expected {
		fmt.Println(string(data))
		t.Error("Different response")
	}
}