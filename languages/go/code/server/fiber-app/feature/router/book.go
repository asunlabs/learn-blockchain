package book

import (
	"fiber-app/feature/database"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SetBookRouter(app *fiber.App) {
	bookRouter := app.Group("/api/v1/book")
	bookRouter.Get("/", GetBooks)
	bookRouter.Get("/:id", GetBook)
	bookRouter.Post("/", AddBook)
	bookRouter.Delete("/", DeleteBook)
}

// TODO 20220910 fix below db query error
// HTTP: GET, POST, DELETE
func GetBooks(c *fiber.Ctx) error {
	var db *gorm.DB
	var books []database.BookSchema
	// db.Find(Book{"title": "ww"})
	db.Find(&books)
	return c.JSON(books)
}

// curl http://localhost:3000/api/v1/book
func GetBook(c *fiber.Ctx) error {
	return c.SendString("get a book")
}

// curl -method POST http://localhost:3000/api/v1/book
func AddBook(c *fiber.Ctx) error {
	return c.SendString("add a book")
}

// curl -method DELETE http://localhost:3000/api/v1/book
func DeleteBook(c *fiber.Ctx) error {
	return c.SendString("delete a book")
}
