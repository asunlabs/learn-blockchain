package main

import (
	"fiber-app/feature/database"
	"fiber-app/feature/router"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
)

const (
	_PORT = 3000
)

func setRoute(app *fiber.App) {
	book.SetBookRouter(app)
}

func main() {
	app := fiber.New()
	database.Init()

	// * from v1.2.0, GORM supports connection pool, removing Close method.
	// use *gorm.DB.DB() instance to use the Close method for specific use case.
	// see here for detail: https://stackoverflow.com/questions/63816057/how-do-i-close-database-instance-in-gorm-1-20-0
	// db, _ := database.Conn.DB()
	// defer db.Close()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello World")
	})

	// /:person => dynamic route
	app.Get("/:person", func(c *fiber.Ctx) error {
		type Person struct {
			Name string `json:"name"` // add metadata for the struct
			Age  int    `json:"age"`
		}

		jake := Person{Name: "jake", Age: 28}

		return c.JSON(jake)
	})

	// /:gender? => may or may not have the parameter
	// app.Get("/:name/:age/:gender?", func(c *fiber.Ctx) error {
	// 	msg := fmt.Sprintf("%s is %s, and %s", c.Params("name"), c.Params("age"), c.Params("gender"))
	// 	return c.SendString(msg)
	// })

	setRoute(app)

	PORT := fmt.Sprintf(":%d", _PORT)
	log.Fatal(app.Listen(PORT))
}
