package book

import (
	"fiber-app/feature/database"
	"github.com/gofiber/fiber/v2"
	"log"
	"strconv"
)

func SetBookRouter(app *fiber.App) {
	bookRouter := app.Group("/api/v1/book")
	bookRouter.Get("/", GetBooks)
	bookRouter.Get("/:id", GetBook)
	bookRouter.Post("/", AddBook)
	bookRouter.Delete("/:id", DeleteBook)
}

// HTTP: GET, POST, DELETE
func GetBooks(c *fiber.Ctx) error {
	db := database.Conn

	var books []database.BookSchema
	// *gorm.DB.Find: find records that match given conditions
	// Find(dest interface{}, conds ...interface{})
	db.Find(&books)

	// JSON converts any interface or string to JSON
	// setting content-header to application/json
	return c.JSON(books)
}

// curl http://localhost:3000/api/v1/book
func GetBook(c *fiber.Ctx) error {
	id := c.Params("id")
	db := database.Conn

	var book database.BookSchema
	db.Find(&book, id)

	return c.JSON(book)
}

// curl -method POST http://localhost:3000/api/v1/book
func AddBook(c *fiber.Ctx) error {
	db := database.Conn

	// check request body
	log.Println(string(c.Request().Body())) // {"title":"some value", "id":"some value"}

	// TODO change dynamic params to dynamic regexp
	// use backslash to escape, \w: one word
	// pattern := regexp.MustCompile(`[a-zA-Z+]:[a-zA-Z+]`)

	// maxNumberOfMatch := 2
	// result := pattern.FindAllString(string(c.Request().Body()), maxNumberOfMatch)

	// log.Println(result)

	// ================= use params ================= //
	// params := c.AllParams()
	// title := params["title"]
	// _id := params["id"]
	// id, _ := strconv.Atoi(_id)
	// db.Create(&database.BookSchema{Title: title, ID: uint(id)})
	// ================= use params ================= //

	// ================= use request body parser ================= //
	// BodyParser binds the request body to a struct.
	newBook := new(database.BookSchema)
	if err := c.BodyParser(newBook); err != nil {
		return c.SendStatus(fiber.StatusServiceUnavailable) // 503
	}

	db.Create(&newBook)
	// ================= use request body parser ================= //

	return c.SendStatus(fiber.StatusCreated)
}

// curl -method DELETE http://localhost:3000/api/v1/book
func DeleteBook(c *fiber.Ctx) error {
	db := database.Conn
	var book database.BookSchema

	_id, err := strconv.Atoi(c.Params("id"))

	if err != nil {
		panic("convert failed")
	}

	id := uint(_id)
	db.Find(&book, id)

	if book.Title == "" {
		return c.SendStatus(fiber.StatusBadRequest)
	}

	db.Delete(&book)
	return c.SendStatus(fiber.StatusOK)
}
