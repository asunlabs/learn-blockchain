package main

import (
	"fmt"
	"log"
	"github.com/gofiber/fiber/v2"
)

const (
	_PORT = 3000
)

func main ()  {
	app := fiber.New()
	app.Get("/", func (c *fiber.Ctx) error {
		return c.SendString("Hello World")
	})

	// /:person => dynamic route
	app.Get("/:person", func(c *fiber.Ctx) error {
		type Person struct {
			Name string `json:"name"` // add metadata for the struct
			Age int `json:"age"`
		}

		jake := Person{Name: "jake", Age: 28}

		return c.JSON(jake)
	})

	// /:gender? => may or may not have the parameter
	app.Get("/:name/:age/:gender?", func(c *fiber.Ctx) error {
		msg := fmt.Sprintf("%s is %s, and %s", c.Params("name"), c.Params("age"), c.Params("gender"))
		return c.SendString(msg)
	})

	PORT := fmt.Sprintf(":%d", _PORT)
	log.Fatal(app.Listen(PORT))
}