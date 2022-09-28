# Learning Go essentials

It is Go, not _Golang_.

> Go compiles quickly to machine code yet has the convenience of garbage collection and the power of run-time reflection. It's a fast, statically typed, compiled language that feels like a dynamically typed, interpreted language.

## Contents

1. [Dependencies, Modules and How to manage Packages](#dependencies-modules-and-how-to-manage-packages)
1. [Formatting](#formatting)
1. [Running test](#running-test)
1. [Reference](#reference)
1. []()

## Dependencies, Modules and How to manage Packages

> A module is a collection of Go packages stored in a file tree with a `"go.mod"` file at its root. This file defines:

- Module path: indicates how our package will be imported by our users, and
- Dependency Requirements, indicate the packages we depend on.

> "Dependency Requirements" not only covers the actual packages but also ways to "Replace" or "Exclude" them, using the corresponding directives:

> Replace: allows replacing a version of a dependency with another one, for example in cases where local deployment is still happening or when working for forked versions;

> Exclude: allows excluding a version of a dependency from use, for example in cases those versions include security issues or bugs.

> "Go Modules" were introduced in Go 1.11 and enabled by default in Go 1.16, they use "Semantic Versioning" (SemVer) as the main versioning system, were versions are defined using three numbers: Major.Minor.Patch.

> The Go toolchain allows interacting with Modules via the "mod" command, but not only that other commands like "get" or "build" are also compatible with Go Modules, the most used commands are:

1. "go mod init" to initialize a module, for example "go mod init github.com/MarioCarrion/example-pkg"

1. "go get _package/version_@_specific-version_" go get packages with specific version, for example "go get github.com/jackc/pgx/v4@v4.10.1"

1. "go get" can be used to upgrade or downgrade as well, for example to downgrade: "go get github.com/jackc/pgx/v4@v4.10.0" or update to latest "go get -u github.com/jackc/pgx/v4"

1. "go mod tidy" to remove unused dependencies.

**Module versioning**

![go-module-semver](https://user-images.githubusercontent.com/83855174/189136245-f6fe0d0a-8c2a-4eb4-89e2-3a99d37b4153.png)

## Formatting

Set beow VS config in settings.json for auto-formatting.

```json
{
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "[go]": {
    "editor.insertSpaces": true,
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "golang.go"
  }
}
```

Run golines to format go codes.

```sh
golines -w .
```

## Environment variables

Run below command to list out go environment variables.

```sh
go env
```

Check output.

```sh
# GOROOT: where go is installed
set GOROOT=C:\Program Files\Go

# GOPATH: local go projects here
set GOPATH=C:\Users\nello\go

set GOBIN=C:\Users\nello\go\bin
```

## Running test

Go support a built-in testing library.

Create a simple function.

```go
func Add(left uint, right uint) uint {
	return left + right
}
```

Create a simple test.

```go
import (
	"fmt"
	"testing"
)
func TestAdd(t *testing.T) {
	result := calc.Add(4, 7)

	if result != 11 {
		t.Error()
	} else {
		fmt.Println("TestAdd passed")
	}

	// sub tests with t.Run()
	t.Run("Should be a five", func(t *testing.T){
		num := 5
		if num != 5 {
			t.Fail()
		}
	})

	t.Run("Should be true", func(t *testing.T){
		isTrue := true
		if isTrue != true {
			t.Fail()
		}
	})
}
```

Run test.

```sh
# v for verbose
go test -v
```

## Reference

- [Learning Golang: Dependencies, Modules and How to manage Packages](https://youtu.be/20sLKEpHvvk)
