# Learning go-sqlmock essentials

1. Create a mock database.
1. Create a mock server
1. Create a mock SQL
1. Create and send a mock http request to the server
1. Asset operation

> sqlmock is a mock library implementing sql/driver. Which has one and only purpose - to simulate any sql driver behavior in tests, without needing a real database connection. It helps to maintain correct TDD workflow.

1. this library is now complete and stable. (you may not find new changes for this reason)
1. supports concurrency and multiple connections.
1. supports go1.8 Context related feature mocking and Named sql parameters.
1. does not require any modifications to your source code.
1. the driver allows to mock any sql driver method behavior.
1. has strict by default expectation order matching.
1. has no third party dependencies.

> NOTE: in v1.2.0 `sqlmock.Rows` has changed to struct from interface, if you were using any type references to that interface, you will need to switch it to a pointer struct type. Also, `sqlmock.Rows` were used to implement `driver.Rows` interface, which was not required or useful for mocking and was removed. Hope it will not cause issues.

## Documentation and Examples

> Visit `godoc` for general examples and public api reference. See .travis.yml for supported go versions. Different use case, is to functionally test with a real database - `go-txdb` all database related actions are isolated within a single transaction so the database can remain in the same state.

> See implementation examples:

```go
// blog API server
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func (a *api) assertJSON(actual []byte, data interface{}, t *testing.T) {
	expected, err := json.Marshal(data)
	if err != nil {
		t.Fatalf("an error '%s' was not expected when marshaling expected json data", err)
	}

	if bytes.Compare(expected, actual) != 0 {
		t.Errorf("the expected json: %s is different from actual %s", expected, actual)
	}
}

func TestShouldGetPosts(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// create app with mocked db, request and response to test
	app := &api{db}
	req, err := http.NewRequest("GET", "http://localhost/posts", nil)
	if err != nil {
		t.Fatalf("an error '%s' was not expected while creating request", err)
	}
	w := httptest.NewRecorder()

	// before we actually execute our api function, we need to expect required DB actions
	rows := sqlmock.NewRows([]string{"id", "title", "body"}).
		AddRow(1, "post 1", "hello").
		AddRow(2, "post 2", "world")

	mock.ExpectQuery("^SELECT (.+) FROM posts$").WillReturnRows(rows)

	// now we execute our request
	app.posts(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status code to be 200, but got: %d", w.Code)
	}

	data := struct {
		Posts []*post
	}{Posts: []*post{
		{ID: 1, Title: "post 1", Body: "hello"},
		{ID: 2, Title: "post 2", Body: "world"},
	}}
	app.assertJSON(w.Body.Bytes(), data, t)

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestShouldRespondWithErrorOnFailure(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	// create app with mocked db, request and response to test
	app := &api{db}
	req, err := http.NewRequest("GET", "http://localhost/posts", nil)
	if err != nil {
		t.Fatalf("an error '%s' was not expected while creating request", err)
	}
	w := httptest.NewRecorder()

	// before we actually execute our api function, we need to expect required DB actions
	mock.ExpectQuery("^SELECT (.+) FROM posts$").WillReturnError(fmt.Errorf("some error"))

	// now we execute our request
	app.posts(w, req)

	if w.Code != 500 {
		t.Fatalf("expected status code to be 500, but got: %d", w.Code)
	}

	data := struct {
		Error string
	}{"failed to fetch posts: some error"}
	app.assertJSON(w.Body.Bytes(), data, t)

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
```

> It does not require any modifications to your source code in order to test and mock database operations. Supports concurrency and multiple database mocking. The driver allows to mock any sql driver method behavior.

```go
// Open new mock database
db, mock, err := New()
if err != nil {
	fmt.Println("error creating mock database")
	return
}
// columns to be used for result
columns := []string{"id", "status"}
// expect transaction begin
mock.ExpectBegin()
// expect query to fetch order, match it with regexp
mock.ExpectQuery("SELECT (.+) FROM orders (.+) FOR UPDATE").
	WithArgs(1).
	WillReturnRows(NewRows(columns).AddRow(1, 1))
// expect transaction rollback, since order status is "cancelled"
mock.ExpectRollback()

// run the cancel order function
someOrderID := 1
// call a function which executes expected database operations
err = cancelOrder(db, someOrderID)
if err != nil {
	fmt.Printf("unexpected error: %s", err)
	return
}

// ensure all expectations have been met
if err = mock.ExpectationsWereMet(); err != nil {
	fmt.Printf("unmet expectation error: %s", err)
}

```

## Reference

- [DATA-DOG - go-sqlmock github](https://github.com/DATA-DOG/go-sqlmock)
- [DATA-DOG - blog API test example](https://github.com/DATA-DOG/go-sqlmock/blob/master/examples/blog/blog_test.go)
- [Sql driver mock for Golang](https://pkg.go.dev/github.com/DATA-DOG/go-sqlmock)
