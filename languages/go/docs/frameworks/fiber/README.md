# Learning Fiber essentials

> An Express-inspired web framework written in Go.

> Fiber is a Go web framework built on top of Fasthttp, the fastest HTTP engine for Go. It's designed to ease things up for fast development with zero memory allocation and performance in mind.

## Philosophy

> New gophers that make the switch from Node.js to Go are dealing with a learning curve before they can start building their web applications or microservices. Fiber, as a web framework, was created with the idea of minimalism and follows the UNIX way, so that new gophers can quickly enter the world of Go with a warm and trusted welcome.

> Fiber is inspired by Express, the most popular web framework on the Internet. We combined the ease of Express and raw performance of Go. If you have ever implemented a web application in Node.js (using Express or similar), then many methods and principles will seem very common to you.

> Fiber is not compatible with net/http interfaces. This means you will not be able to use projects like gqlgen, go-swagger, or any others which are part of the net/http ecosystem.

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

## Fiber

> Fiber represents the fiber package where you start to create an instance.

### New and Config

> New: This method creates a new App named instance. You can pass optional settings when creating a new instance.

> Config: You can pass an optional Config when creating a new Fiber instance.

```go
// Custom config
app := fiber.New(fiber.Config{
    Prefork:       true,
    CaseSensitive: true,
    StrictRouting: true,
    ServerHeader:  "Fiber",
    AppName: "Test App v1.0.1"
})
```

### NewError

> NewError creates a new HTTPError instance with an optional message.

```go
app.Get("/", func(c *fiber.Ctx) error {
    return fiber.NewError(782, "Custom error message")
})
```

## App instance

> The app instance conventionally denotes the Fiber application.

### Static

> Use the Static method to serve static files such as images, CSS, and JavaScript. Use the following code to serve files in a directory named ./public

```go
app.Static("/", "./public")

// => http://localhost:3000/hello.html
// => http://localhost:3000/js/jquery.js
// => http://localhost:3000/css/style.css
```

> You can use any virtual path prefix (where the path does not actually exist in the file system) for files that are served by the Static method, specify a prefix path for the static directory, as shown below:

```go
app.Static("/static", "./public")

// => http://localhost:3000/static/hello.html
// => http://localhost:3000/static/js/jquery.js
// => http://localhost:3000/static/css/style.css
```

> If you want to have a little bit more control regarding the settings for serving static files. You could use the fiber.Static struct to enable specific settings.

```go
// Custom config
app.Static("/", "./public", fiber.Static{
  Compress:      true,
  ByteRange:     true,
  Browse:        true,
  Index:         "john.html"
  CacheDuration: 10 * time.Second,
  MaxAge:        3600,
})
```

### Route handlers

> Registeres a route bound to a specific HTTP method.

```go
// HTTP methods
func (app *App) Get(path string, handlers ...Handler) Router
func (app *App) Head(path string, handlers ...Handler) Router
func (app *App) Post(path string, handlers ...Handler) Router
func (app *App) Put(path string, handlers ...Handler) Router
func (app *App) Delete(path string, handlers ...Handler) Router
func (app *App) Connect(path string, handlers ...Handler) Router
func (app *App) Options(path string, handlers ...Handler) Router
func (app *App) Trace(path string, handlers ...Handler) Router
func (app *App) Patch(path string, handlers ...Handler) Router

// Add allows you to specifiy a method as value
func (app *App) Add(method, path string, handlers ...Handler) Router

// All will register the route on all HTTP methods
// Almost the same as app.Use but not bound to prefixes
func (app *App) All(path string, handlers ...Handler) Router
```

> Use can be used for middleware packages and prefix catchers. These routes will only match the beginning of each path i.e. /john will match /john/doe, /johnnnnn etc

```go
// Match any request
app.Use(func(c *fiber.Ctx) error {
    return c.Next()
})

// Match request starting with /api
app.Use("/api", func(c *fiber.Ctx) error {
    return c.Next()
})

// Attach multiple handlers
app.Use("/api",func(c *fiber.Ctx) error {
  c.Set("X-Custom-Header", random.String(32))
//   logic here
    return c.Next()
}, func(c *fiber.Ctx) error {
	//   logic here
    return c.Next()
})
```

### Mount

> You can Mount Fiber instance by creating a \*Mount

```go
func main() {
    micro := fiber.New()
    micro.Get("/doe", func(c *fiber.Ctx) error {
        return c.SendStatus(fiber.StatusOK)
    })

    app := fiber.New()
    app.Mount("/john", micro) // GET /john/doe -> 200 OK

    log.Fatal(app.Listen(":3000"))
}
```

### Group

> You can group routes by creating a \*Group struct.

```go
func main() {
  app := fiber.New()

  api := app.Group("/api", handler)  // /api

  v1 := api.Group("/v1", handler)   // /api/v1
  v1.Get("/list", handler)          // /api/v1/list
  v1.Get("/user", handler)          // /api/v1/user

  v2 := api.Group("/v2", handler)   // /api/v2
  v2.Get("/list", handler)          // /api/v2/list
  v2.Get("/user", handler)          // /api/v2/user

  log.Fatal(app.Listen(":3000"))
}
```

### Route

> You can define routes with a common prefix inside the common function.

```go
func main() {
  app := fiber.New()

  app.Route("/test", func(api fiber.Router) {
      api.Get("/foo", handler).Name("foo") // /test/foo (name: test.foo)
    api.Get("/bar", handler).Name("bar") // /test/bar (name: test.bar)
  }, "test.")

  log.Fatal(app.Listen(":3000"))
}
```

### Server

> Server returns the underlying fasthttp server

```go
func main() {
    app := fiber.New()
    app.Server().MaxConnsPerIP = 1
}
```

### HandlersCount

> This method returns the amount of registered handlers.

```go
func (app *App) HandlersCount() uint32
```

### Test

> Testing your application is done with the Test method. Use this method for creating \_test.go files or when you need to debug your routing logic. The default timeout is 1s if you want to disable a timeout altogether, pass -1 as a second argument.

```go
// Create route with GET method for test:
app.Get("/", func(c *fiber.Ctx) error {
  fmt.Println(c.BaseURL())              // => http://google.com
  fmt.Println(c.Get("X-Custom-Header")) // => hi

  return c.SendString("hello, World!")
})

// http.Request
req := httptest.NewRequest("GET", "http://google.com", nil)
req.Header.Set("X-Custom-Header", "hi")

// http.Response
resp, _ := app.Test(req)

// Do something with results:
if resp.StatusCode == fiber.StatusOK {
  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(body)) // => Hello, World!
}
```

## Reference

- [Fiber official docs](https://gofiber.io/#)
