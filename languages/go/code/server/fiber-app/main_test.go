package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
)

type Tests struct {
	name          string
	server        *httptest.Server
	response      *Chair
	expectedError error
}

func TestGetChair(t *testing.T) {
	tests := []Tests{
		{
			name: "basic request",
			server: httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("wefwef"))
			})),
			response: &Chair{
				Name: "jake's chair",
				Height: 100,
			},
			expectedError: nil,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			defer test.server.Close()

			resp := mockResponse

			if reflect.DeepEqual(resp, test.response) {
				t.Error()
			} else {
				fmt.Println("api test success")
			}
		})
	}
}
