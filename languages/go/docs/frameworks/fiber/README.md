# Learning Fiber essentials

> An Express-inspired web framework written in Go.

> Fiber is a Go web framework built on top of Fasthttp, the fastest HTTP engine for Go. It's designed to ease things up for fast development with zero memory allocation and performance in mind.

## Zero allocation

> Some values returned from **\*fiber.Ctx are not immutable** by default.
> Because fiber is optimized for high-performance, values returned from fiber.Ctx are not immutable by default and will be _re-used across requests_. As a rule of thumb, you must only use context values within the handler, and you must not keep any references.

> As soon as you return from the handler, any values you have obtained from the context will be re-used in future requests and will change below your feet. Here is an example:

```go
func handler(c *fiber.Ctx) error {
    // Variable is only valid within this handler
    result := c.Params("foo")

    // ...
}
```

> If you need to persist such values outside the handler, make copies of their underlying buffer using the `copy` builtin. Here is an example for persisting a string:

```go
func handler(c *fiber.Ctx) error {
    // Variable is only valid within this handler
    result := c.Params("foo")

    // Make a copy
    buffer := make([]byte, len(result))
    copy(buffer, result)
    resultCopy := string(buffer)
    // Variable is now valid forever

    // ...
}
```

> We created a custom CopyString function that does the above and is available under gofiber/utils.

```go
app.Get("/:foo", func(c *fiber.Ctx) error {
	// Variable is now immutable
	result := utils.CopyString(c.Params("foo"))

	// ...
})
```

> Alternatively, you can also use the Immutable setting. It will make all values returned from the context immutable, allowing you to persist them anywhere. Of course, this comes at the cost of performance.

```go
app := fiber.New(&fiber.Settings{
	Immutable: true,
})
```

## Basic routing

> Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, PUT, POST, etc.).
> Each route can have multiple handler functions that are executed when the route is matched.
> Route definition takes the following structures:

```go
// Function signature
// app: fiber instance
// func(*fiber.Ctx) error is a callback containing the Context executed when the route is matched
app.Method(path string, ...func(*fiber.Ctx) error)
```

**Simple route**

```go
// Respond with "Hello, World!" on root path, "/"
app.Get("/", func(c *fiber.Ctx) error {
	return c.SendString("Hello, World!")
})
```

**Parameters**

```go
// GET http://localhost:8080/hello%20world

app.Get("/:value", func(c *fiber.Ctx) error {
	return c.SendString("value: " + c.Params("value"))
	// => Get request with value: hello world
})
```

**Optional parameter**

```go
// GET http://localhost:3000/john

app.Get("/:name?", func(c *fiber.Ctx) error {
	if c.Params("name") != "" {
		return c.SendString("Hello " + c.Params("name"))
		// => Hello john
	}
	return c.SendString("Where is john?")
})
```

**Wildcards**

```go
// GET http://localhost:3000/api/user/john

app.Get("/api/*", func(c *fiber.Ctx) error {
	return c.SendString("API path: " + c.Params("*"))
	// => API path: user/john
})
```

## Static files

> To serve static files such as images, CSS, and JavaScript files, replace your function handler with a file or directory string.

```go
app.Static(prefix, root string, config ...Static)
```

> Use the following code to serve files in a directory named ./public:

```go
app := fiber.New()

app.Static("/", "./public")

app.Listen(":3000")
```

> Now, you can load the files that are in the ./public directory:

```
http://localhost:8080/hello.html
http://localhost:8080/js/jquery.js
http://localhost:8080/css/style.css
```

## Reference

- [Fiber official docs](https://gofiber.io/#)
