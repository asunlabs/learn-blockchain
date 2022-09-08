# Learning Ginkgo essentials

> **Ginkgo** is a testing framework for Go designed to help you write expressive tests. It is best paired with the **Gomega** matcher library. When combined, Ginkgo and Gomega provide a rich and expressive DSL (Domain-specific Language) for writing tests.

> Ginkgo is sometimes described as a `"Behavior Driven Development" (BDD)` framework. In reality, Ginkgo is a general purpose testing framework in active use across a wide variety of testing contexts: unit tests, integration tests, acceptance test, performance tests, etc.

> The narrative docs you are reading here are supplemented by the godoc API-level docs. We suggest starting here to build a mental model for how Ginkgo works and understand how the Ginkgo DSL can be used to solve real-world testing scenarios. These docs are written assuming you are familiar with Go and the Go toolchain and that you are using Ginkgo V2 (V1 is no longer supported - see here for the migration guide).

## Why Ginkgo?

> Like all software projects, Ginkgo was written at a particular time and place to solve a particular set of problems.

> A sprawling distributed system, originally written in Ruby, that was slowly migrating towards the emerging distributed systems language of choice: Go.

> For engineers coming from the rich ecosystems of testing frameworks such as Jasmine, rspec, and Cedar there was a need for a comprehensive testing framework with a mature set of matchers in Go.

> Moreover, the nature of the code being built - `complex distributed systems` - required a testing framework that could provide for the needs unique to `unit-testing` and `integration-testing` such a system. We needed to make testing asynchronous behavior ubiquitous and straightforward. We needed to have parallelizable integration tests to ensure our test run-times didn't get out of control. We needed a test framework that helped us suss out flaky tests and fix them.

## Getting started

> In this section we cover installing Ginkgo, Gomega, and the ginkgo CLI. We bootstrap a Ginkgo suite, write our first spec, and run it.

### Installing Ginkgo

> Ginkgo uses go modules. To add Ginkgo to your project, assuming you have a go.mod file setup, just go install it:

```sh
go install github.com/onsi/ginkgo/v2/ginkgo
go get github.com/onsi/gomega/...
```

> This fetches Ginkgo and installs the ginkgo executable under $GOBIN - you'll want that on your $PATH. It also fetches the core Gomega matcher library and its set of supporting libraries. Note that the current supported major version of Ginkgo is v2.

> You should now be able to run ginkgo version at the command line and see the Ginkgo CLI emit a version number.

### Your First Ginkgo Suite

> Ginkgo hooks into Go's existing testing infrastructure. That means that Ginkgo specs live in *\_test.go files, just like standard go tests. However, instead of using func `TestX(t *testing.T) {}` to write your tests you use the Ginkgo and Gomega DSLs.

> We call a collection of Ginkgo specs in a given package a Ginkgo suite; and we use the word spec to talk about individual Ginkgo tests contained in the suite. Though they're functionally interchangeable, we'll use the word `"spec"` instead of "test" to make a distinction between `Ginkgo tests` and traditional testing tests.

> In most Ginkgo suites there is only one TestX function - the entry point for Ginkgo. Let's bootstrap a Ginkgo suite to see what that looks like.

### Bootstrapping a Suite

> Say you have a package named books that you'd like to add a Ginkgo suite to. To bootstrap the suite run:

```sh
cd path/to/books
ginkgo bootstrap
Generating ginkgo test suite bootstrap for books in:
  books_suite_test.go
```

> This will generate a file named books_suite_test.go in the books directory containing:

```
package books_test

import (
  . "github.com/onsi/ginkgo/v2"
  . "github.com/onsi/gomega"
  "testing"
)

func TestBooks(t *testing.T) {
  RegisterFailHandler(Fail)
  RunSpecs(t, "Books Suite")
}
```

> Let's break this down:

> First, ginkgo bootstrap generates a new test file and places it in the books_test package. That small detail is actually quite important so let's take a brief detour to discuss how Go organizes code in general, and test packages in particular.

- Go package 1 + package 2 ... packge N = Go module
- Directory 1(go package 1 + go test) + Directory 2(go package 2+ go test) ... + Directory N(go package N + go test) = Go module

> Go code is organized into `modules`. A module is typically associated with a version controlled repository and is comprised of a series of versioned `packages`. Each package is typically associated with a single directory within the module's file tree containing a series of source code files. When testing Go code, unit tests for a package typically reside within the same directory as the package and are named \*\_test.go. Ginkgo follows this convention.

> It's also possible to construct test-only packages comprised solely of \*\_test.go files. For example, module-level integration tests typically live in their own test-only package directory and exercise the various packages of the module as a whole. As Ginkgo simply builds on top of Go's existing test infrastructure, this usecase is supported and encouraged as well.

> Normally, Go only allows _one package to live in a given directory_ (in our case, it would be a package named books). There is, however, one exception to this rule: a package ending in \_test is allowed to live in the same directory as the package being tested.

> Doing so instructs Go to compile the package's test suite as a separate package. This means your test suite will not have access to the internals of the books package and will need to import the books package to access its external interface. Ginkgo defaults to setting up the suite as a \*\_test package to encourage you to only test the external behavior of your package, not its internal implementation details.

## Reference

- [Ginkgo official docs](https://onsi.github.io/ginkgo/#installing-ginkgo)
