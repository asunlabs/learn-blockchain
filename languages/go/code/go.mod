module learn-blockchain

go 1.19

// go.mod controls deps: 1) require 2) replace 3) exclude
// go.sum aggregates the checksums the deps. 
// go uses this file to build projects in a secure way(keeping deps intact with checksum)

require (
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/stretchr/testify v1.8.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)
