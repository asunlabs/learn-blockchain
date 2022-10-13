# Learning GORM essentials

> The fantastic ORM library for Golang aims to be developer friendly.

## Contents

- [Learning GORM essentials](#learning-gorm-essentials)
  - [Quick start](#quick-start)

## Quick start

```go
package main

import (
  "gorm.io/gorm"
  "gorm.io/driver/sqlite"
)

type Product struct {
    gorm.Model
    Code string
    Price uint
}

func main() {
    db, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})

    if err != nil {
        panic("connection failed")
    }

    // schema migration
    db.AutoMigrate(&Product{})

    // create a record
    db.Create(&Product{ Code:"D42", Price:100 })

    // read a record
    var product Product
    db.First(&product, 1) // find product with integer primary key
    db.Find(&product, "code = ?", "D42")

    // update a record
    db.Model(&product).Update("Price", 200)

    // Update - update multiple fields
    db.Model(&product).Updates(map[string]interface{}{"Price": 200, "Code": "F42"})

    // Delete - delete product
    db.Delete(&product, 1)
}

```

## Declaring Models

> Models are normal structs with basic Go types, pointers/alias of them or custom types implementing Scanner and Valuer interfaces

```go
type User struct {
  ID           uint
  Name         string
  Email        *string
  Age          uint8
  Birthday     *time.Time
  MemberNumber sql.NullString
  ActivatedAt  sql.NullTime
  CreatedAt    time.Time
  UpdatedAt    time.Time
}
```

### Conventions

> GORM prefers convention over configuration. By default, GORM uses `ID` as `primary key`, pluralizes struct name to `snake_cases` as table name, snake_case as column name, and uses `CreatedAt`, `UpdatedAt` to track creating/updating time.

> If you follow the conventions adopted by GORM, you’ll need to write very little configuration/code. If convention doesn’t match your requirements, GORM allows you to configure them

### gorm.Model

> GORM defined a `gorm.Model` struct, which includes fields `ID`, `CreatedAt`, `UpdatedAt`, `DeletedAt`

```go
// gorm.Model definition
type Model struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

> You can embed it into your struct to include those fields. For anonymous fields, GORM will include its fields into its parent struct, for example:

```go
type User struct {
  gorm.Model
  Name string
}
// equals
type User struct {
  ID        uint           `gorm:"primaryKey"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`
  Name string
}
```

> For a normal struct field, you can embed it with the tag `embedded`, for example:

```go
type Author struct {
  Name  string
  Email string
}

type Blog struct {
  ID      int
  Author  Author `gorm:"embedded"`
  Upvotes int32
}
// equals
type Blog struct {
  ID    int64
  Name  string
  Email string
  Upvotes  int32
}
```

> And you can use tag `embeddedPrefix` to add prefix to embedded fields’ db name, for example:

```go
type Blog struct {
  ID      int
  Author  Author `gorm:"embedded;embeddedPrefix:author_"`
  Upvotes int32
}
// equals
type Blog struct {
  ID          int64
  AuthorName  string
  AuthorEmail string
  Upvotes     int32
}
```

## Advanced

### Field-Level Permission

> Exported fields have all permissions when doing CRUD with GORM, and GORM allows you to _change the field-level permission with tag_, so you can make a field to be read-only, write-only, create-only, update-only or ignored

> NOTE ignored fields won’t be created when using GORM Migrator to create table

```go
type User struct {
  Name string `gorm:"<-:create"` // allow read and create
  Name string `gorm:"<-:update"` // allow read and update
  Name string `gorm:"<-"`        // allow read and write (create and update)
  Name string `gorm:"<-:false"`  // allow read, disable write permission
  Name string `gorm:"->"`        // readonly (disable write permission unless it configured)
  Name string `gorm:"->;<-:create"` // allow read and create
  Name string `gorm:"->:false;<-:create"` // createonly (disabled read from db)
  Name string `gorm:"-"`            // ignore this field when write and read with struct
  Name string `gorm:"-:all"`        // ignore this field when write, read and migrate with struct
  Name string `gorm:"-:migration"`  // ignore this field when migrate with struct
}
```

### Creating/Updating Time/Unix (Milli/Nano) Seconds Tracking

> GORM use `CreatedAt`, `UpdatedAt` to track creating/updating time by convention, and **GORM will set the current time when creating/updating if the fields are defined**

> To use fields with a different name, you can configure those fields with tag `autoCreateTime`, `autoUpdateTime`

> If you prefer to save UNIX (milli/nano) seconds instead of time, you can simply change the field’s data type from `time.Time` to `int`

```go
type User struct {
  CreatedAt time.Time // Set to current time if it is zero on creating
  UpdatedAt int       // Set to current unix seconds on updating or if it is zero on creating
  Updated   int64 `gorm:"autoUpdateTime:nano"` // Use unix nano seconds as updating time
  Updated   int64 `gorm:"autoUpdateTime:milli"`// Use unix milli seconds as updating time
  Created   int64 `gorm:"autoCreateTime"`      // Use unix seconds as creating time
}
```

### Fields Tags

> Tags are optional to use when declaring models, GORM supports the following tags: Tags are case insensitive, however camelCase is preferred.

> GORM allows configure foreign keys, constraints, many2many table through tags for Associations, check out the Associations section for details

## Connecting to a Database

> GORM officially supports the databases MySQL, PostgreSQL, SQLite, SQL Server

### MySQL

```go
import (
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

func main() {
  // refer https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
  dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
```

> To handle time.Time correctly, you need to include parseTime as a parameter. (more parameters)
> To fully support UTF-8 encoding, you need to change `charset=utf8` to `charset=utf8mb4`.

> MySQL Driver provides a few advanced configurations which can be used during initialization, for example:

```go
db, err := gorm.Open(mysql.New(mysql.Config{
  DSN: "gorm:gorm@tcp(127.0.0.1:3306)/gorm?charset=utf8&parseTime=True&loc=Local", // data source name
  DefaultStringSize: 256, // default size for string fields
  DisableDatetimePrecision: true, // disable datetime precision, which not supported before MySQL 5.6
  DontSupportRenameIndex: true, // drop & create when rename index, rename index not supported before MySQL 5.7, MariaDB
  DontSupportRenameColumn: true, // `change` when rename column, rename column not supported before MySQL 8, MariaDB
  SkipInitializeWithVersion: false, // auto configure based on currently MySQL version
}), &gorm.Config{})
```

#### Customize Driver

> GORM allows to customize the MySQL driver with the DriverName option, for example:

```go
import (
  _ "example.com/my_mysql_driver"
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

db, err := gorm.Open(mysql.New(mysql.Config{
  DriverName: "my_mysql_driver",
  DSN: "gorm:gorm@tcp(localhost:9910)/gorm?charset=utf8&parseTime=True&loc=Local", // data source name, refer https://github.com/go-sql-driver/mysql#dsn-data-source-name
}), &gorm.Config{})
```

#### Existing database connection

> GORM allows to initialize \*gorm.DB with an existing database connection

```go
import (
  "database/sql"
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

sqlDB, err := sql.Open("mysql", "mydb_dsn")
gormDB, err := gorm.Open(mysql.New(mysql.Config{
  Conn: sqlDB,
}), &gorm.Config{})
```

### PostgreSQL

```go
import (
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
)

dsn := "host=localhost user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
```

> We are using `pgx` as postgres’s database/sql driver, it enables prepared statement cache by default, to disable it:

```go
// https://github.com/go-gorm/postgres
db, err := gorm.Open(postgres.New(postgres.Config{
  DSN: "user=gorm password=gorm dbname=gorm port=9920 sslmode=disable TimeZone=Asia/Shanghai",
  PreferSimpleProtocol: true, // disables implicit prepared statement usage
}), &gorm.Config{})
```

#### Customize Driver

> GORM allows to customize the PostgreSQL driver with the DriverName option, for example:

```go
import (
  _ "github.com/GoogleCloudPlatform/cloudsql-proxy/proxy/dialers/postgres"
  "gorm.io/gorm"
)

db, err := gorm.Open(postgres.New(postgres.Config{
  DriverName: "cloudsqlpostgres",
  DSN: "host=project:region:instance user=postgres dbname=postgres password=password sslmode=disable",
})
```

#### Existing database connection

> GORM allows to initialize \*gorm.DB with an existing database connection

```go
import (
  "database/sql"
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
)

sqlDB, err := sql.Open("pgx", "mydb_dsn")
gormDB, err := gorm.Open(postgres.New(postgres.Config{
  Conn: sqlDB,
}), &gorm.Config{})
```

### SQLite

```go
import (
  "gorm.io/driver/sqlite" // Sqlite driver based on GGO
  // "github.com/glebarez/sqlite" // Pure go SQLite driver, checkout https://github.com/glebarez/sqlite for details
  "gorm.io/gorm"
)

// github.com/mattn/go-sqlite3
db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
```

### Connection Pool

> GORM using database/sql to maintain connection pool

```go
sqlDB, err := db.DB()

// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
sqlDB.SetMaxIdleConns(10)

// SetMaxOpenConns sets the maximum number of open connections to the database.
sqlDB.SetMaxOpenConns(100)

// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
sqlDB.SetConnMaxLifetime(time.Hour)
```

## CRUD Interface

### Create

#### Create Record

```go
user := User{Name: "Jinzhu", Age: 18, Birthday: time.Now()}

result := db.Create(&user) // pass pointer of data to Create

user.ID             // returns inserted data's primary key
result.Error        // returns error
result.RowsAffected // returns inserted records count
```

## Reference

- [GORM official docs](https://gorm.io/docs/index.html)
