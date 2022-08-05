package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// Install ngrok for accessible localhost
// Windows: choco install ngrok(administrator)
// Run ngrok http (port-number) to generate accessible URL

type Developer struct {
	Name string `json:"name"` // struct tag
	Field string `json:"field"`
	Age int `json:"age"`
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("root handler called"))
}

func ApiHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("api handler called"))
}

func DeveloperGetter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // let browser know data type

	developer := Developer {
		Name: "Jake Sung",
		Field: "Blockchain developer",
		Age: 28,
	}

	json.NewEncoder(w).Encode(developer)
}

func main() {
	http.HandleFunc("/", RootHandler)
	http.HandleFunc("/api", ApiHandler)
	http.HandleFunc("/developer", DeveloperGetter)

	log.Fatal(http.ListenAndServe(":3000", nil))
}