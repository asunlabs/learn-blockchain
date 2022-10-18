package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type testJson struct {
	Name string `json:"name"`
}

type job struct { 
	ID uint `json:"id"`
	Name string `json:"name"`
}

func APIHandler(w http.ResponseWriter, r *http.Request) {

	myJson := testJson{Name: "jake"}
	w.WriteHeader(http.StatusOK)

	// Marshal returns the JSON encoding of v.
	encoded, _ := json.Marshal(myJson)
	w.Write(encoded)
}

func GetJobById(w http.ResponseWriter, r *http.Request)  {
	log.Println(r.URL)
	_job := job{Name: "developer", ID:  1}

	data, _ := json.Marshal(_job)

	w.WriteHeader(http.StatusOK)

	// Write writes the data to the connection as part of an HTTP reply.
	w.Write(data)
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("httptest exercise for server app"))
	})

	http.HandleFunc("/api", APIHandler)
	http.HandleFunc("/job:id", GetJobById)

	log.Fatalf("listening at %d", http.ListenAndServe(":3000", nil))
}