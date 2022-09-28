package file

import (
	"log"
	"os"
)

func ReadFile() string {
	data, err := os.ReadFile("hello.txt")

	if err != nil {
		log.Fatal()
	}

	return string(data)
}
