# Learning GORM essentials

> The fantastic ORM library for Golang aims to be developer friendly.

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

## Reference

- [GORM official docs](https://gorm.io/docs/index.html)
