# GORM tutorials by official docs

## Context

> GORM provides Context support, you can use it with method WithContext

### Single Session Mode

> Single session mode usually used when you want to perform a single operation

```go
db.WithContext(ctx).Find(&users)
```

### Continuous session mode

> Continuous session mode is usually used when you want to perform a group of operations, for example:

```go
tx := db.WithContext(ctx)
tx.First(&user, 1)
tx.Model(&user).Update("role", "admin")
```

### Context timeout

> You can pass in a context with a timeout to db.WithContext to set timeout for long running queries, for example:

```go
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

db.WithContext(ctx).Find(&users)
```

### Context in Hooks/Callbacks

> You can access the Context object from the current Statement, for example:

```go
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
  ctx := tx.Statement.Context
  // ...
  return
}
```

### Chi Middleware Example

> `Continuous session mode` which might be helpful when handling API requests, for example, you can set up *gorm.DB with Timeout Context in middlewares, and then use the *gorm.DB when processing all requests

> Following is a Chi middleware example:

```go
func SetDBMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    timeoutContext, _ := context.WithTimeout(context.Background(), time.Second)
    ctx := context.WithValue(r.Context(), "DB", db.WithContext(timeoutContext))
    next.ServeHTTP(w, r.WithContext(ctx))
  })
}

r := chi.NewRouter()
r.Use(SetDBMiddleware)

r.Get("/", func(w http.ResponseWriter, r *http.Request) {
  db, ok := ctx.Value("DB").(*gorm.DB)

  var users []User
  db.Find(&users)

  // lots of db operations
})

r.Get("/user", func(w http.ResponseWriter, r *http.Request) {
  db, ok := ctx.Value("DB").(*gorm.DB)

  var user User
  db.First(&user)

  // lots of db operations
})
```

> NOTE Setting Context with WithContext is goroutine-safe, refer Session for details

## Error Handling

> In Go, error handling is important. You are encouraged to do error check after any Finisher Methods.

### Error Handling

> Error handling in GORM is different than idiomatic Go code because of its chainable API. If any error occurs, GORM will set \*gorm.DB‘s Error field, you need to check it like this:

```go
if err := db.Where("name = ?", "jinzhu").First(&user).Error; err != nil {
  // error handling...
}
```

Or

```go
if result := db.Where("name = ?", "jinzhu").First(&user); result.Error != nil {
  // error handling...
}
```

### ErrRecordNotFound

> GORM returns `ErrRecordNotFound` when failed to find data with First, Last, Take, if there are several errors happened, you can check the ErrRecordNotFound error with `errors.Is`, for example:

```go
// Check if returns RecordNotFound error
err := db.First(&user, 100).Error
errors.Is(err, gorm.ErrRecordNotFound)
```

Check error list below.

```go
package gorm

import (
	"errors"

	"gorm.io/gorm/logger"
)

var (
	// ErrRecordNotFound record not found error
	ErrRecordNotFound = logger.ErrRecordNotFound
	// ErrInvalidTransaction invalid transaction when you are trying to `Commit` or `Rollback`
	ErrInvalidTransaction = errors.New("invalid transaction")
	// ErrNotImplemented not implemented
	ErrNotImplemented = errors.New("not implemented")
	// ErrMissingWhereClause missing where clause
	ErrMissingWhereClause = errors.New("WHERE conditions required")
	// ErrUnsupportedRelation unsupported relations
	ErrUnsupportedRelation = errors.New("unsupported relations")
	// ErrPrimaryKeyRequired primary keys required
	ErrPrimaryKeyRequired = errors.New("primary key required")
	// ErrModelValueRequired model value required
	ErrModelValueRequired = errors.New("model value required")
	// ErrInvalidData unsupported data
	ErrInvalidData = errors.New("unsupported data")
	// ErrUnsupportedDriver unsupported driver
	ErrUnsupportedDriver = errors.New("unsupported driver")
	// ErrRegistered registered
	ErrRegistered = errors.New("registered")
	// ErrInvalidField invalid field
	ErrInvalidField = errors.New("invalid field")
	// ErrEmptySlice empty slice found
	ErrEmptySlice = errors.New("empty slice found")
	// ErrDryRunModeUnsupported dry run mode unsupported
	ErrDryRunModeUnsupported = errors.New("dry run mode unsupported")
	// ErrInvalidDB invalid db
	ErrInvalidDB = errors.New("invalid db")
	// ErrInvalidValue invalid value
	ErrInvalidValue = errors.New("invalid value, should be pointer to struct or slice")
	// ErrInvalidValueOfLength invalid values do not match length
	ErrInvalidValueOfLength = errors.New("invalid association values, length doesn't match")
	// ErrPreloadNotAllowed preload is not allowed when count is used
	ErrPreloadNotAllowed = errors.New("preload is not allowed when count is used")
)
```
