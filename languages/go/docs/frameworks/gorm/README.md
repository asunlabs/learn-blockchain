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

#### Create Record With Selected Fields

> Create a record and assign a value to the fields specified.

```go
db.Select("Name", "Age", "CreatedAt").Create(&user)
// INSERT INTO `users` (`name`,`age`,`created_at`) VALUES ("jinzhu", 18, "2020-07-04 11:05:21.775")
```

> Create a record and ignore the values for fields passed to omit.

```go
db.Omit("Name", "Age", "CreatedAt").Create(&user)
// INSERT INTO `users` (`birthday`,`updated_at`) VALUES ("2020-01-01 00:00:00.000", "2020-07-04 11:05:21.775")
```

#### Batch Insert

> To efficiently insert large number of records, pass a slice to the Create method. GORM will generate a single SQL statement to insert all the data and backfill primary key values, hook methods will be invoked too.

```go
var users = []User{{Name: "jinzhu1"}, {Name: "jinzhu2"}, {Name: "jinzhu3"}}
db.Create(&users)

for _, user := range users {
  user.ID // 1,2,3
}
```

> You can specify batch size when creating with CreateInBatches, e.g:

```go
var users = []User{{Name: "jinzhu_1"}, ...., {Name: "jinzhu_10000"}}

// batch size 100
db.CreateInBatches(users, 100)
```

> Batch Insert is also supported when using Upsert and Create With Associations

> NOTE initialize GORM with CreateBatchSize option, all INSERT will respect this option when creating record & associations

```go
db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{
  CreateBatchSize: 1000,
})

db := db.Session(&gorm.Session{CreateBatchSize: 1000})

users = [5000]User{{Name: "jinzhu", Pets: []Pet{pet1, pet2, pet3}}...}

db.Create(&users)
// INSERT INTO users xxx (5 batches)
// INSERT INTO pets xxx (15 batches)
```

#### Create Hooks

> GORM allows user defined hooks to be implemented for `BeforeSave`, `BeforeCreate`, `AfterSave`, `AfterCreate`. These hook method will be called when creating a record, refer Hooks for details on the lifecycle

```go
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
  u.UUID = uuid.New()

  if u.Role == "admin" {
    return errors.New("invalid role")
  }
  return
}
```

> If you want to skip Hooks methods, you can use the `SkipHooks` session mode, for example:

```go
DB.Session(&gorm.Session{SkipHooks: true}).Create(&user)

DB.Session(&gorm.Session{SkipHooks: true}).Create(&users)

DB.Session(&gorm.Session{SkipHooks: true}).CreateInBatches(users, 100)
```

#### Create from Map

> GORM supports create from map[string]interface{} and []map[string]interface{}{}, e.g:

```go
db.Model(&User{}).Create(map[string]interface{}{
  "Name": "jinzhu", "Age": 18,
})

// batch insert from `[]map[string]interface{}{}`
db.Model(&User{}).Create([]map[string]interface{}{
  {"Name": "jinzhu_1", "Age": 18},
  {"Name": "jinzhu_2", "Age": 20},
})
```

> NOTE When creating from map, hooks won’t be invoked, associations won’t be saved and primary key values won’t be back filled

### Query

#### Retrieving a single object

> GORM provides `First`, `Take`, `Last` methods to retrieve a single object from the database, it adds `LIMIT 1` condition when querying the database, and it will return the error `ErrRecordNotFound` if no record is found.

```go
// Get the first record ordered by primary key
db.First(&user)
// SELECT * FROM users ORDER BY id LIMIT 1;

// Get one record, no specified order
db.Take(&user)
// SELECT * FROM users LIMIT 1;

// Get last record, ordered by primary key desc
db.Last(&user)
// SELECT * FROM users ORDER BY id DESC LIMIT 1;

result := db.First(&user)
result.RowsAffected // returns count of records found
result.Error        // returns error or nil

// check error ErrRecordNotFound
errors.Is(result.Error, gorm.ErrRecordNotFound)
```

> If you want to avoid the `ErrRecordNotFound` error, you could use `Find` like `db.Limit(1).Find(&user)`, the Find method accepts both struct and slice data

> The `First` and `Last` methods will find the first and last record (respectively) as ordered by primary key. They only work when a pointer to the destination struct is passed to the methods as argument or when the model is specified using `db.Model()`. Additionally, if no primary key is defined for relevant model, then the model will be ordered by the first field. For example:

```go
var user User
var users []User

// works because destination struct is passed in
db.First(&user)
// SELECT * FROM `users` ORDER BY `users`.`id` LIMIT 1

// works because model is specified using `db.Model()`
result := map[string]interface{}{}
db.Model(&User{}).First(&result)
// SELECT * FROM `users` ORDER BY `users`.`id` LIMIT 1

// doesn't work
result := map[string]interface{}{}
db.Table("users").First(&result)

// works with Take
result := map[string]interface{}{}
db.Table("users").Take(&result)

// no primary key defined, results will be ordered by first field (i.e., `Code`)
type Language struct {
  Code string
  Name string
}
db.First(&Language{})
// SELECT * FROM `languages` ORDER BY `languages`.`code` LIMIT 1
```

#### Retrieving objects with primary key

> Objects can be retrieved _using primary key_ by using Inline Conditions if the primary key is a number. When working with strings, extra care needs to be taken to avoid SQL Injection; check out Security section for details.

```go
db.First(&user, 10)
// SELECT * FROM users WHERE id = 10;

db.First(&user, "10")
// SELECT * FROM users WHERE id = 10;

db.Find(&users, []int{1,2,3})
// SELECT * FROM users WHERE id IN (1,2,3);
```

> If the primary key is a string (for example, like a uuid), the query will be written as follows:

```go
db.First(&user, "id = ?", "1b74413f-f3b8-409f-ac47-e8c062e3472a")
// SELECT * FROM users WHERE id = "1b74413f-f3b8-409f-ac47-e8c062e3472a";
```

> When the destination object has a primary value, the primary key will be used to build the condition, for example:

```go
var user = User{ID: 10}
db.First(&user)
// SELECT * FROM users WHERE id = 10;

var result User
db.Model(User{ID: 10}).First(&result)
// SELECT * FROM users WHERE id = 10;
```

#### Retrieving all objects

```go
// Get all records
result := db.Find(&users)
// SELECT * FROM users;

result.RowsAffected // returns found records count, equals `len(users)`
result.Error        // returns error
```

#### Conditions

##### String Conditions

```go
// Get first matched record
db.Where("name = ?", "jinzhu").First(&user)
// SELECT * FROM users WHERE name = 'jinzhu' ORDER BY id LIMIT 1;

// Get all matched records
db.Where("name <> ?", "jinzhu").Find(&users)
// SELECT * FROM users WHERE name <> 'jinzhu';

// IN
db.Where("name IN ?", []string{"jinzhu", "jinzhu 2"}).Find(&users)
// SELECT * FROM users WHERE name IN ('jinzhu','jinzhu 2');

// LIKE
db.Where("name LIKE ?", "%jin%").Find(&users)
// SELECT * FROM users WHERE name LIKE '%jin%';

// AND
db.Where("name = ? AND age >= ?", "jinzhu", "22").Find(&users)
// SELECT * FROM users WHERE name = 'jinzhu' AND age >= 22;

// Time
db.Where("updated_at > ?", lastWeek).Find(&users)
// SELECT * FROM users WHERE updated_at > '2000-01-01 00:00:00';

// BETWEEN
db.Where("created_at BETWEEN ? AND ?", lastWeek, today).Find(&users)
// SELECT * FROM users WHERE created_at BETWEEN '2000-01-01 00:00:00' AND '2000-01-08 00:00:00';
```

### Update

#### Save All Fields

> Save will save all fields when performing the Updating SQL

```go
// retrive a single object by pointer
db.First(&user)

// update fields
user.Name = "jinzhu 2"
user.Age = 100

// save a record
db.Save(&user)
// UPDATE users SET name='jinzhu 2', age=100, birthday='2016-01-01', updated_at = '2013-11-17 21:34:10' WHERE id=111;
```

#### Update single column

> When updating a single column with Update, it needs to have any conditions or it will raise error `ErrMissingWhereClause`, checkout Block Global Updates for details. When using the Model method and its value has a primary value, **the primary key will be used to build the condition**, for example:

```go
// Update with conditions
db.Model(&User{}).Where("active = ?", true).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE active=true;

// User's ID is `111`:
db.Model(&user).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111;

// Update with conditions and model value
db.Model(&user).Where("active = ?", true).Update("name", "hello")
// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111 AND active=true;
```

#### Updates multiple columns

> Updates supports updating with struct or map[string]interface{}, when updating with struct it will only update non-zero fields by default

```go
// Update attributes with `struct`, will only update non-zero fields
db.Model(&user).Updates(User{Name: "hello", Age: 18, Active: false})
// UPDATE users SET name='hello', age=18, updated_at = '2013-11-17 21:34:10' WHERE id = 111;

// Update attributes with `map`
db.Model(&user).Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET name='hello', age=18, active=false, updated_at='2013-11-17 21:34:10' WHERE id=111;
```

> NOTE When updating with struct, GORM will only update non-zero fields. You might want to use map to update attributes or use Select to specify fields to update

#### Update Selected Fields

> If you want to update selected fields or ignore some fields when updating, you can use `Select`, `Omit`

```go
// Select with Map
// User's ID is `111`:
db.Model(&user).Select("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET name='hello' WHERE id=111;

db.Model(&user).Omit("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "active": false})
// UPDATE users SET age=18, active=false, updated_at='2013-11-17 21:34:10' WHERE id=111;

// Select with Struct (select zero value fields)
db.Model(&user).Select("Name", "Age").Updates(User{Name: "new_name", Age: 0})
// UPDATE users SET name='new_name', age=0 WHERE id=111;

// Select all fields (select all fields include zero value fields)
db.Model(&user).Select("*").Update(User{Name: "jinzhu", Role: "admin", Age: 0})

// Select all fields but omit Role (select all fields include zero value fields)
db.Model(&user).Select("*").Omit("Role").Update(User{Name: "jinzhu", Role: "admin", Age: 0})
```

#### Update Hooks

> GORM allows the hooks `BeforeSave`, `BeforeUpdate`, `AfterSave`, `AfterUpdate`. Those methods will be called when updating a record, refer Hooks for details

#### Change Updating Values

> To change updating values in Before Hooks, you should use `SetColumn` unless it is a full update with Save, for example:

```go
func (user *User) BeforeSave(tx *gorm.DB) (err error) {
  if pw, err := bcrypt.GenerateFromPassword(user.Password, 0); err == nil {
    tx.Statement.SetColumn("EncryptedPassword", pw)
  }

  if tx.Statement.Changed("Code") {
    user.Age += 20
    tx.Statement.SetColumn("Age", user.Age)
  }
}

db.Model(&user).Update("Name", "jinzhu")
```

### Delete

#### Delete a Record

> When deleting a record, the deleted value needs to have primary key or it will trigger a Batch Delete, for example:

```go
// Email's ID is `10`
db.Delete(&email)
// DELETE from emails where id = 10;

// Delete with additional conditions
db.Where("name = ?", "jinzhu").Delete(&email)
// DELETE from emails where id = 10 AND name = "jinzhu";
```

#### Delete with primary key

GORM allows to delete objects using primary key(s) with inline condition, it works with numbers, check out Query Inline Conditions for details

```go
db.Delete(&User{}, 10)
// DELETE FROM users WHERE id = 10;

db.Delete(&User{}, "10")
// DELETE FROM users WHERE id = 10;

db.Delete(&users, []int{1,2,3})
// DELETE FROM users WHERE id IN (1,2,3);
```

#### Delete Hooks

> GORM allows hooks `BeforeDelete`, `AfterDelete`, those methods will be called when deleting a record, refer Hooks for details.

```go
func (u *User) BeforeDelete(tx *gorm.DB) (err error) {
  if u.Role == "admin" {
    return errors.New("admin user not allowed to delete")
  }
  return
}
```

#### Soft Delete

> If your model includes a `gorm.DeletedAt` field (which is included in gorm.Model), it will get soft delete ability automatically!

When calling Delete, **the record WON’T be removed from the database**, but GORM will set the DeletedAt‘s value to the current time, and the data is not findable with normal Query methods anymore.

```go
// user's ID is `111`
db.Delete(&user)
// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE id = 111;

// Batch Delete
db.Where("age = ?", 20).Delete(&User{})
// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE age = 20;

// Soft deleted records will be ignored when querying
db.Where("age = 20").Find(&user)
// SELECT * FROM users WHERE age = 20 AND deleted_at IS NULL;
```

#### Find soft deleted records

> You can find soft deleted records with `Unscoped`

```go
db.Unscoped().Where("age = 20").Find(&users)
// SELECT * FROM users WHERE age = 20;
```

#### Delete permanently

> You can delete matched records permanently with `Unscoped`

```go
db.Unscoped().Delete(&order)
// DELETE FROM orders WHERE id=10;
```

## Associations

### Belongs To

> A belongs to association sets up a `one-to-one` connection with another model, such that each instance of the declaring model “belongs to” one instance of the other model.

> For example, if your application includes users and companies, and each user can be assigned to exactly one company, the following types represent that relationship. Notice here that, on the User object, there is both a CompanyID as well as a Company. By default, the CompanyID is implicitly used to create a foreign key relationship between the User and Company tables, and **thus must be included in the User struct in order to fill the Company inner struct**.

```go
// `User` belongs to `Company`, `CompanyID` is the foreign key
type User struct {
  gorm.Model
  Name      string
  CompanyID int
  Company   Company
}

type Company struct {
  ID   int
  Name string
}
```

#### Override Foreign Key

> To define a belongs to relationship, the foreign key must exist, the default foreign key uses the owner’s type name plus its primary field name.

> For the above example, to define the User model that belongs to Company, the foreign key should be CompanyID by convention

> GORM provides a way to customize the foreign key, for example:

```go
type User struct {
  gorm.Model
  Name         string
  CompanyRefer int
  Company      Company `gorm:"foreignKey:CompanyRefer"`
  // use CompanyRefer as foreign key
}

type Company struct {
  ID   int
  Name string
}
```

#### Override References

> For a belongs to relationship, GORM usually uses the owner’s primary field as the foreign key’s value, for the above example, it is Company‘s field ID.

> When you assign a user to a company, GORM will save the company’s ID into the user’s CompanyID field.

> You are able to change it with tag references, e.g:

```go
type User struct {
  gorm.Model
  Name      string
  CompanyID string
  Company   Company `gorm:"references:Code"` // use Code as references
}

type Company struct {
  ID   int
  Code string
  Name string
}
```

> GORM usually guess the relationship as has one if override foreign key name already exists in owner’s type, we need to specify references in the belongs to relationship.

### Has One

> A `has one` association sets up a `one-to-one` connection with another model, but with somewhat different semantics (and consequences). This association indicates that each instance of a model contains or possesses one instance of another model.

> For example, if your application includes users and credit cards, and each user can only have one credit card.

```go
// # Declare
// User has one CreditCard, UserID is the foreign key
type User struct {
  gorm.Model
  CreditCard CreditCard
}

type CreditCard struct {
  gorm.Model
  Number string
  UserID uint
}

// # Retrieve
// Retrieve user list with eager loading credit card
func GetAll(db *gorm.DB) ([]User, error) {
  var users []User
  err := db.Model(&User{}).Preload("CreditCard").Find(&users).Error
  return users, err
}
```

#### Override Foreign Key

> For a has one relationship, a foreign key field must also exist, the owner will save the primary key of the model belongs to it into this field.

> The field’s name is usually generated with has one model’s type plus its primary key, for the above example it is UserID.

When you give a credit card to the user, it will save the User’s ID into its UserID field.

If you want to use another field to save the relationship, you can change it with tag foreignKey, e.g:

```go
type User struct {
  gorm.Model
  CreditCard CreditCard `gorm:"foreignKey:UserName"`
  // use UserName as foreign key
}

type CreditCard struct {
  gorm.Model
  Number   string
  UserName string
}
```

#### Override References

> By default, the owned entity will save the has one model’s primary key into a foreign key, you could change to save another field’s value, like using Name for the below example.

> You are able to change it with tag references, e.g:

```go
type User struct {
  gorm.Model
  Name       string     `gorm:"index"`
  CreditCard CreditCard `gorm:"foreignkey:UserName;references:name"`
}

type CreditCard struct {
  gorm.Model
  Number   string
  UserName string
}
```

#### Polymorphism Association

> GORM supports polymorphism association for has one and has many, it will save owned entity’s table name into polymorphic type’s field, primary key into the polymorphic field

```go
type Cat struct {
  ID    int
  Name  string
  Toy   Toy `gorm:"polymorphic:Owner;"`
}

type Dog struct {
  ID   int
  Name string
  Toy  Toy `gorm:"polymorphic:Owner;"`
}

type Toy struct {
  ID        int
  Name      string
  OwnerID   int
  OwnerType string
}

db.Create(&Dog{Name: "dog1", Toy: Toy{Name: "toy1"}})
// INSERT INTO `dogs` (`name`) VALUES ("dog1")
// INSERT INTO `toys` (`name`,`owner_id`,`owner_type`)
```

> You can change the polymorphic type value with tag polymorphicValue, for example:

```go
type Dog struct {
  ID   int
  Name string
  Toy  Toy `gorm:"polymorphic:Owner;polymorphicValue:master"`
}

type Toy struct {
  ID        int
  Name      string
  OwnerID   int
  OwnerType string
}

db.Create(&Dog{Name: "dog1", Toy: Toy{Name: "toy1"}})
// INSERT INTO `dogs` (`name`) VALUES ("dog1")
// INSERT INTO `toys` (`name`,`owner_id`,`owner_type`) VALUES ("toy1","1","master")
```

### Has Many

> A has many association sets up a one-to-many connection with another model, unlike has one, the owner could have zero or many instances of models.

> For example, if your application includes users and credit card, and each user can have many credit cards.

#### Declare

```go
// User has many CreditCards, UserID is the foreign key
type User struct {
  gorm.Model
  CreditCards []CreditCard
}

type CreditCard struct {
  gorm.Model
  Number string
  UserID uint
}
```

#### Retrieve

```go
// Retrieve user list with eager loading credit cards
func GetAll(db *gorm.DB) ([]User, error) {
    var users []User
    err := db.Model(&User{}).Preload("CreditCards").Find(&users).Error
    return users, err
}
```

#### Override Foreign Key

> To define a has many relationship, a foreign key must exist. The default foreign key’s name is the owner’s type name plus the name of its primary key field

> For example, to define a model that belongs to User, the foreign key should be UserID.

> To use another field as foreign key, you can customize it with a foreignKey tag, e.g:

```go
type User struct {
  gorm.Model
  CreditCards []CreditCard `gorm:"foreignKey:UserRefer"`
}

type CreditCard struct {
  gorm.Model
  Number    string
  UserRefer uint
}
```

#### Override References

> GORM usually uses the owner’s primary key as the foreign key’s value, for the above example, it is the User‘s ID,

> When you assign credit cards to a user, GORM will save the user’s ID into credit cards’ UserID field.

> You are able to change it with tag references, e.g:

```go
type User struct {
  gorm.Model
  MemberNumber string
  CreditCards  []CreditCard `gorm:"foreignKey:UserNumber;references:MemberNumber"`
}

type CreditCard struct {
  gorm.Model
  Number     string
  UserNumber string
}
```

#### Polymorphism Association

> GORM supports polymorphism association for has one and has many, it will save owned entity’s table name into polymorphic type’s field, primary key value into the polymorphic field

```go
type Dog struct {
  ID   int
  Name string
  Toys []Toy `gorm:"polymorphic:Owner;"`
}

type Toy struct {
  ID        int
  Name      string
  OwnerID   int
  OwnerType string
}

db.Create(&Dog{Name: "dog1", Toys: []Toy{{Name: "toy1"}, {Name: "toy2"}}})
// INSERT INTO `dogs` (`name`) VALUES ("dog1")
// INSERT INTO `toys` (`name`,`owner_id`,`owner_type`) VALUES ("toy1","1","dogs"), ("toy2","1","dogs")
```

> You can change the polymorphic type value with tag polymorphicValue, for example:

```go
type Dog struct {
  ID   int
  Name string
  Toys []Toy `gorm:"polymorphic:Owner;polymorphicValue:master"`
}

type Toy struct {
  ID        int
  Name      string
  OwnerID   int
  OwnerType string
}

db.Create(&Dog{Name: "dog1", Toy: []Toy{{Name: "toy1"}, {Name: "toy2"}}})
// INSERT INTO `dogs` (`name`) VALUES ("dog1")
// INSERT INTO `toys` (`name`,`owner_id`,`owner_type`) VALUES ("toy1","1","master"), ("toy2","1","master")
```

#### CRUD with Has Many

> Please checkout Association Mode for working with has many relations

#### Eager Loading

> GORM allows eager loading has many associations with `Preload`, refer Preloading (Eager loading) for details

### Many To Many

> Many to Many add a join table between two models.

> For example, if your application includes users and languages, and a user can speak many languages, and many users can speak a specified language.

```go
// User has and belongs to many languages, `user_languages` is the join table
type User struct {
  gorm.Model
  Languages []Language `gorm:"many2many:user_languages;"`
}

type Language struct {
  gorm.Model
  Name string
}
```

> When using GORM `AutoMigrate` to create a table for User, GORM will create the join table automatically

#### Back-Reference

```go
// User has and belongs to many languages, use `user_languages` as join table
type User struct {
  gorm.Model
  Languages []*Language `gorm:"many2many:user_languages;"`
}

type Language struct {
  gorm.Model
  Name string
  Users []*User `gorm:"many2many:user_languages;"`
}
```

#### Retrieve

```go
// Retrieve user list with eager loading languages
func GetAllUsers(db *gorm.DB) ([]User, error) {
  var users []User
  err := db.Model(&User{}).Preload("Languages").Find(&users).Error
  return users, err
}

// Retrieve language list with eager loading users
func GetAllLanguages(db *gorm.DB) ([]Language, error) {
  var languages []Language
  err := db.Model(&Language{}).Preload("Users").Find(&languages).Error
  return languages, err
}
```

#### Override Foreign Key

> For a many2many relationship, the join table owns the foreign key which references two models, for example:

```go
type User struct {
  gorm.Model
  Languages []Language `gorm:"many2many:user_languages;"`
}

type Language struct {
  gorm.Model
  Name string
}

// Join Table: user_languages
//   foreign key: user_id, reference: users.id
//   foreign key: language_id, reference: languages.id
```

> To override them, you can use tag foreignKey, references, joinForeignKey, joinReferences, not necessary to use them together, you can just use one of them to override some foreign keys/references

```go
type User struct {
  gorm.Model
  Profiles []Profile `gorm:"many2many:user_profiles;foreignKey:Refer;joinForeignKey:UserReferID;References:UserRefer;joinReferences:ProfileRefer"`
  Refer    uint      `gorm:"index:,unique"`
}

type Profile struct {
  gorm.Model
  Name      string
  UserRefer uint `gorm:"index:,unique"`
}

// Which creates join table: user_profiles
//   foreign key: user_refer_id, reference: users.refer
//   foreign key: profile_refer, reference: profiles.user_refer
```

#### Foreign key constraints

> You can setup OnUpdate, OnDelete constraints with tag constraint, it will be created when migrating with GORM, for example:

```go
type User struct {
  gorm.Model
  Languages []Language `gorm:"many2many:user_speaks;"`
}

type Language struct {
  Code string `gorm:"primarykey"`
  Name string
}

// CREATE TABLE `user_speaks` (`user_id` integer,`language_code` text,PRIMARY KEY (`user_id`,`language_code`),CONSTRAINT `fk_user_speaks_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,CONSTRAINT `fk_user_speaks_language` FOREIGN KEY (`language_code`) REFERENCES `languages`(`code`) ON DELETE SET NULL ON UPDATE CASCADE);
```

> You are also allowed to delete selected many2many relations with Select when deleting, checkout Delete with Select for details

#### Composite Foreign Keys

> If you are using Composite Primary Keys for your models, GORM will enable composite foreign keys by default

> You are allowed to override the default foreign keys, to specify multiple foreign keys, just separate those keys’ name by commas, for example:

```go
type Tag struct {
  ID     uint   `gorm:"primaryKey"`
  Locale string `gorm:"primaryKey"`
  Value  string
}

type Blog struct {
  ID         uint   `gorm:"primaryKey"`
  Locale     string `gorm:"primaryKey"`
  Subject    string
  Body       string
  Tags       []Tag `gorm:"many2many:blog_tags;"`
  LocaleTags []Tag `gorm:"many2many:locale_blog_tags;ForeignKey:id,locale;References:id"`
  SharedTags []Tag `gorm:"many2many:shared_blog_tags;ForeignKey:id;References:id"`
}

// Join Table: blog_tags
//   foreign key: blog_id, reference: blogs.id
//   foreign key: blog_locale, reference: blogs.locale
//   foreign key: tag_id, reference: tags.id
//   foreign key: tag_locale, reference: tags.locale

// Join Table: locale_blog_tags
//   foreign key: blog_id, reference: blogs.id
//   foreign key: blog_locale, reference: blogs.locale
//   foreign key: tag_id, reference: tags.id

// Join Table: shared_blog_tags
//   foreign key: blog_id, reference: blogs.id
//   foreign key: tag_id, reference: tags.id
```

>

## Reference

- [GORM official docs](https://gorm.io/docs/index.html)
