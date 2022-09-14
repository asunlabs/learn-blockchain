# Learning Fiber essentials

> An Express-inspired web framework written in Go.

> Fiber is a Go web framework built on top of Fasthttp, the fastest HTTP engine for Go. It's designed to ease things up for fast development with zero memory allocation and performance in mind.

## Contents

1. [Philosophy](#philosophy)
1. [Zero allocation](#zero-allocation)
1. [Basic routing](#basic-routing)
1. [Static files](#static-files)
1. [Fiber package](#fiber)
1. [App instance](#app-instance)
1. [Context](#context)
1. []()

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

## Context

> The Ctx struct represents the Context which hold the HTTP request and response. It has methods for the request query string, parameters, body, HTTP headers, and so on.

### Accepts

> Checks, if the specified extensions or content types are acceptable based on the request’s Accept HTTP header.

```go
// Accept: text/*, application/json

app.Get("/", func(c *fiber.Ctx) error {
  c.Accepts("html")             // "html"
  c.Accepts("text/html")        // "text/html"
  c.Accepts("json", "text")     // "json"
  c.Accepts("application/json") // "application/json"
  c.Accepts("image/png")        // ""
  c.Accepts("png")              // ""
  // ...
})
```

### AllParams

> Params is used to get all route parameters. Using Params method to get params.

```go
// GET http://example.com/user/fenny
app.Get("/user/:name", func(c *fiber.Ctx) error {
  c.AllParams() // "{"name": "fenny"}"

  // ...
})

// GET http://example.com/user/fenny/123
app.Get("/user/*", func(c *fiber.Ctx) error {
  c.AllParams()  // "{"*1": "fenny/123"}"

  // ...
})
```

### ParamsParser

> This method is similar to BodyParser, but for path parameters. It is important to use the `struct tag "params"`. For example, if you want to parse a path parameter with a field called Pass, you would use a struct field of `params:"pass"`

```go
// GET http://example.com/user/111
app.Get("/user/:id", func(c *fiber.Ctx) error {
  param := struct {ID uint `params:"id"`}{}

  c.ParamsParser(&param) // "{"id": 111}"

  // ...
})
```

### Path

> Contains the path part of the `request URL`. Optionally, you could override the path by passing a string. For internal redirects, you might want to call RestartRouting instead of Next.

```go
// GET http://example.com/users?sort=desc

app.Get("/users", func(c *fiber.Ctx) error {
  c.Path() // "/users"

  c.Path("/john")
  c.Path() // "/john"

  // ...
})
```

### App

> Returns the \*App reference so you could easily access all application settings.

```go
app.Get("/stack", func(c *fiber.Ctx) error {
  return c.JSON(c.App().Stack())
})
```

### Append

> Appends the specified value to the HTTP response header field. If the header is not already set, it creates the header with the specified value.

```go
app.Get("/", func(c *fiber.Ctx) error {
  c.Append("Link", "http://google.com", "http://localhost")
  // => Link: http://localhost, http://google.com

  c.Append("Link", "Test")
  // => Link: http://localhost, http://google.com, Test

  // ...
})
```

### Attachment

> Sets the HTTP response Content-Disposition header field to attachment.

```go
app.Get("/", func(c *fiber.Ctx) error {
  c.Attachment()
  // => Content-Disposition: attachment

  c.Attachment("./upload/images/logo.png")
  // => Content-Disposition: attachment; filename="logo.png"
  // => Content-Type: image/png

  // ...
})
```

### BaseURL

> Returns the base URL (protocol + host) as a string.

```go
// GET https://example.com/page#chapter-1

app.Get("/", func(c *fiber.Ctx) error {
  c.BaseURL() // https://example.com
  // ...
})
```

### Body

> Returns the raw request body.

```go
// curl -X POST http://localhost:8080 -d user=john

app.Post("/", func(c *fiber.Ctx) error {
  // Get raw body from POST request:
  return c.Send(c.Body()) // []byte("user=john")
})
```

### BodyParser

> Binds the request body to a struct.

> It is important to specify the correct struct tag based on the content type to be parsed. For example, if you want to parse a JSON body with a field called Pass, you would use a struct field of `json:"pass"`.

- application/x-www-form-urlencoded: form struct tag
- multipart/form-data: form struct tag
- application/json: json struct tag
- application/xml: xml struct tag
- text/xml: xml

```go
// Field names should start with an uppercase letter
type Person struct {
    Name string `json:"name" xml:"name" form:"name"`
    Pass string `json:"pass" xml:"pass" form:"pass"`
}

app.Post("/", func(c *fiber.Ctx) error {
        p := new(Person)

        if err := c.BodyParser(p); err != nil {
            return err
        }

        log.Println(p.Name) // john
        log.Println(p.Pass) // doe

        // ...
})

// Run tests with the following curl commands

// curl -X POST -H "Content-Type: application/json" --data "{\"name\":\"john\",\"pass\":\"doe\"}" localhost:3000

// curl -X POST -H "Content-Type: application/xml" --data "<login><name>john</name><pass>doe</pass></login>" localhost:3000

// curl -X POST -H "Content-Type: application/x-www-form-urlencoded" --data "name=john&pass=doe" localhost:3000

// curl -X POST -F name=john -F pass=doe http://localhost:3000

// curl -X POST "http://localhost:3000/?name=john&pass=doe"
```

### ClearCookie

> Expire a client cookie (or all cookies if left empty)

```go
app.Get("/", func(c *fiber.Ctx) error {
  // Clears all cookies:
  c.ClearCookie()

  // Expire specific cookie by name:
  c.ClearCookie("user")

  // Expire multiple cookies by names:
  c.ClearCookie("token", "session", "track_id", "version")
  // ...
})
```

> Web browsers and other compliant clients will only clear the cookie if the given options are identical to those when creating the cookie, excluding expires and maxAge. ClearCookie will not set these values for you - a technique similar to the one shown below should be used to ensure your cookie is deleted.

```go
// set cookie
app.Get("/set", func(c *fiber.Ctx) error {
    c.Cookie(&fiber.Cookie{
        Name:     "token",
        Value:    "randomvalue",
        Expires:  time.Now().Add(24 * time.Hour),
        HTTPOnly: true,
        SameSite: "lax",
    })

    // ...
})

// delete cookie
app.Get("/delete", func(c *fiber.Ctx) error {
    c.Cookie(&fiber.Cookie{
        Name:     "token",
        // Set expiry date to the past
        Expires:  time.Now().Add(-(time.Hour * 2)),
        HTTPOnly: true,
        SameSite: "lax",
    })

    // ...
})
```

### Cookie

> Set cookie

```go
// Cookie type definition
type Cookie struct {
    Name        string    `json:"name"`
    Value       string    `json:"value"`
    Path        string    `json:"path"`
    Domain      string    `json:"domain"`
    MaxAge      int       `json:"max_age"`
    Expires     time.Time `json:"expires"`
    Secure      bool      `json:"secure"`
    HTTPOnly    bool      `json:"http_only"`
    SameSite    string    `json:"same_site"`
    SessionOnly bool      `json:"session_only"`
}

// usage
app.Get("/", func(c *fiber.Ctx) error {
  // Create cookie
  cookie := new(fiber.Cookie)
  cookie.Name = "john"
  cookie.Value = "doe"
  cookie.Expires = time.Now().Add(24 * time.Hour)

  // Set cookie
  c.Cookie(cookie)
  // ...
})
```

### Cookies

> Get cookie value by key, you could pass an optional default value that will be returned if the cookie key does not exist.

```go
app.Get("/", func(c *fiber.Ctx) error {
  // Get cookie by key:
  c.Cookies("name")         // "john"
  c.Cookies("empty", "doe") // "doe"
  // ...
})
```

### Download

> Transfers the file from path as an attachment. Typically, browsers will prompt the user to download. By default, the `Content-Disposition` header `filename=` parameter is the file path (this typically appears in the browser dialog).

> Override this default with the filename parameter.

```go
app.Get("/", func(c *fiber.Ctx) error {
  return c.Download("./files/report-12345.pdf");
  // => Download report-12345.pdf

  return c.Download("./files/report-12345.pdf", "report.pdf");
  // => overriding the default with fimename report.pdf => Download report.pdf
})
```

### Format

> Performs content-negotiation on the Accept HTTP header. It uses Accepts to select a proper format.

```go
app.Get("/", func(c *fiber.Ctx) error {
  // Accept: text/plain
  c.Format("Hello, World!")
  // => Hello, World!

  // Accept: text/html
  c.Format("Hello, World!")
  // => <p>Hello, World!</p>

  // Accept: application/json
  c.Format("Hello, World!")
  // => "Hello, World!"
  // ..
})
```

### FormFile

> MultipartForm files can be retrieved by name, the first file from the given key is returned.

```go
app.Post("/", func(c *fiber.Ctx) error {
  // Get first file from form field "document":
  file, err := c.FormFile("document")

  // Save file to root directory:
  return c.SaveFile(file, fmt.Sprintf("./%s", file.Filename))
})
```

### FormValue

> Any form values can be retrieved by name, the first value from the given key is returned.

```go
app.Post("/", func(c *fiber.Ctx) error {
  // Get first value from form field "name":
  c.FormValue("name")
  // => "john" or "" if not exist

  // ..
})
```

### JSONP

> Sends a JSON response with JSONP support. This method is identical to JSON, except that it opts-in to JSONP callback support. By default, the callback name is simply callback.

> Override this by passing a named string in the method.

```go
type SomeStruct struct {
  name string
  age  uint8
}

app.Get("/", func(c *fiber.Ctx) error {
  // Create data struct:
  data := SomeStruct{
    name: "Grame",
    age:  20,
  }

  return c.JSONP(data)
  // => callback({"name": "Grame", "age": 20})

  return c.JSONP(data, "customFunc")
  // => customFunc({"name": "Grame", "age": 20})
})
```

### Locals

> A method that stores variables scoped to the request and, therefore, are available only to the routes that match the request. This is useful if you want to pass some specific data to the next middleware.

```go
// set a request-wide variable
app.Use(func(c *fiber.Ctx) error {
  c.Locals("user", "admin")
  return c.Next()
})

// next middleware
app.Get("/admin", func(c *fiber.Ctx) error {
  if c.Locals("user") == "admin" {
    return c.Status(fiber.StatusOK).SendString("Welcome, admin!")
  }
  return c.SendStatus(fiber.StatusForbidden)

})
```

### MultipartForm

> To access multipart form entries, you can parse the binary with MultipartForm(). This returns a map[string][]string, so given a key, the value will be a string slice.

```go
app.Post("/", func(c *fiber.Ctx) error {
  // Parse the multipart form:
  if form, err := c.MultipartForm(); err == nil {
    // => *multipart.Form

    if token := form.Value["token"]; len(token) > 0 {
      // Get key value:
      fmt.Println(token[0])
    }

    // Get all files from "documents" key:
    files := form.File["documents"]
    // => []*multipart.FileHeader

    // Loop through files:
    for _, file := range files {
      fmt.Println(file.Filename, file.Size, file.Header["Content-Type"][0])
      // => "tutorial.pdf" 360641 "application/pdf"

      // Save the files to disk:
      if err := c.SaveFile(file, fmt.Sprintf("./%s", file.Filename)); err != nil {
        return err
      }
    }
  }

  return err
})
```

### Next

> When `Next` is called, it executes the next method in the stack that matches the current route. You can pass an error struct within the method that will end the chaining and call the error handler.

```go
app.Get("/", func(c *fiber.Ctx) error {
  fmt.Println("1st route!")
  return c.Next()
})

app.Get("*", func(c *fiber.Ctx) error {
  fmt.Println("2nd route!")
  return c.Next()
})

app.Get("/", func(c *fiber.Ctx) error {
  fmt.Println("3rd route!")
  return c.SendString("Hello, World!")
})
```

## Middleware

> Middleware is a function chained in the HTTP request cycle with _access to the Context_ which it uses to perform a specific action, for example, logging every request or enabling CORS.

### Basic Auth

> Basic Authentication middleware for Fiber that provides an HTTP basic authentication. It calls the next handler for valid credentials and 401 Unauthorized or a custom response for missing or invalid credentials.

**Examples**

> Import the middleware package that is part of the Fiber web framework

```go
import (
  "github.com/gofiber/fiber/v2"
  "github.com/gofiber/fiber/v2/middleware/basicauth"
)
```

> After you initiate your Fiber app, you can use the following possibilities:

```go
// Provide a minimal config
app.Use(basicauth.New(basicauth.Config{
    Users: map[string]string{
        "john":  "doe",
        "admin": "123456",
    },
}))

// Or extend your config for customization
app.Use(basicauth.New(basicauth.Config{
    Users: map[string]string{
        "john":  "doe",
        "admin": "123456",
    },
    Realm: "Forbidden",
    Authorizer: func(user, pass string) bool {
        if user == "john" && pass == "doe" {
            return true
        }
        if user == "admin" && pass == "123456" {
            return true
        }
        return false
    },
    Unauthorized: func(c *fiber.Ctx) error {
        return c.SendFile("./unauthorized.html")
    },
    ContextUsername: "_user",
    ContextPassword: "_pass",
}))
```

**Config**

Default config is as follows.

```go
var ConfigDefault = Config{
    Next:            nil,
    Users:           map[string]string{},
    Realm:           "Restricted",
    Authorizer:      nil,
    Unauthorized:    nil,
    ContextUsername: "username",
    ContextPassword: "password",
}
```

```go
// Config defines the config for middleware.
type Config struct {
    // Next defines a function to skip this middleware when returned true.
    //
    // Optional. Default: nil
    Next func(c *fiber.Ctx) bool

    // Users defines the allowed credentials
    //
    // Required. Default: map[string]string{}
    Users map[string]string

    // Realm is a string to define realm attribute of BasicAuth.
    // the realm identifies the system to authenticate against
    // and can be used by clients to save credentials
    //
    // Optional. Default: "Restricted".
    Realm string

    // Authorizer defines a function you can pass
    // to check the credentials however you want.
    // It will be called with a username and password
    // and is expected to return true or false to indicate
    // that the credentials were approved or not.
    //
    // Optional. Default: nil.
    Authorizer func(string, string) bool

    // Unauthorized defines the response body for unauthorized responses.
    // By default it will return with a 401 Unauthorized and the correct WWW-Auth header
    //
    // Optional. Default: nil
    Unauthorized fiber.Handler

    // ContextUser is the key to store the username in Locals
    //
    // Optional. Default: "username"
    ContextUsername string

    // ContextPass is the key to store the password in Locals
    //
    // Optional. Default: "password"
    ContextPassword string
}
```

### CORS

> CORS middleware for Fiber that can be used to enable `Cross-Origin Resource Sharing` with various options.

> Import the middleware package that is part of the Fiber web framework.

```go
import (
  "github.com/gofiber/fiber/v2"
  "github.com/gofiber/fiber/v2/middleware/cors"
)
```

> After you initiate your Fiber app, you can use the following possibilities:

```go
// Default config
app.Use(cors.New())

// Or extend your config for customization
app.Use(cors.New(cors.Config{
    AllowOrigins: "https://gofiber.io, https://gofiber.net",
    AllowHeaders:  "Origin, Content-Type, Accept",
}))
```

Default CORS config is as follows.

```go
var ConfigDefault = Config{
    Next:             nil,
    AllowOrigins:     "*",
    AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
    AllowHeaders:     "",
    AllowCredentials: false,
    ExposeHeaders:    "",
    MaxAge:           0,
}
```

**Config**

```go
// Config defines the config for middleware.
type Config struct {
    // Next defines a function to skip this middleware when returned true.
    //
    // Optional. Default: nil
    Next func(c *fiber.Ctx) bool

    // AllowOrigin defines a list of origins that may access the resource.
    //
    // Optional. Default value "*"
    AllowOrigins string

    // AllowMethods defines a list of methods allowed when accessing the resource.
    // This is used in response to a preflight request.
    //
    // Optional. Default value "GET,POST,HEAD,PUT,DELETE,PATCH"
    AllowMethods string

    // AllowHeaders defines a list of request headers that can be used when
    // making the actual request. This is in response to a preflight request.
    //
    // Optional. Default value "".
    AllowHeaders string

    // AllowCredentials indicates whether or not the response to the request
    // can be exposed when the credentials flag is true. When used as part of
    // a response to a preflight request, this indicates whether or not the
    // actual request can be made using credentials.
    //
    // Optional. Default value false.
    AllowCredentials bool

    // ExposeHeaders defines a whitelist headers that clients are allowed to
    // access.
    //
    // Optional. Default value "".
    ExposeHeaders string

    // MaxAge indicates how long (in seconds) the results of a preflight request
    // can be cached.
    //
    // Optional. Default value 0.
    MaxAge int
}
```

### Cache

> Cache middleware for Fiber designed to intercept responses and cache them. This middleware will cache the `Body`, `Content-Type` and `StatusCode` using the `c.Path()` as unique identifier. Special thanks to @codemicro for creating this middleware for Fiber core!

**Examples**

> Import the middleware package that is part of the Fiber web framework

```go
import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cache"
)
```

> After you initiate your Fiber app, you can use the following possibilities:

```go
// Initialize default config
app.Use(cache.New())

// Or extend your config for customization
app.Use(cache.New(cache.Config{
    Next: func(c *fiber.Ctx) bool {
        return c.Query("refresh") == "true"
    },
    Expiration: 30 * time.Minute,
    CacheControl: true,
}))
```

> Or you can custom key and expire time like this:

```go
app.Use(New(Config{
    ExpirationGenerator: func(c *fiber.Ctx, cfg *Config) time.Duration {
        newCacheTime, _ := strconv.Atoi(c.GetRespHeader("Cache-Time", "600"))
        return time.Second * time.Duration(newCacheTime)
    },
    KeyGenerator: func(c *fiber.Ctx) string {
        return c.Path()
    }
}))

app.Get("/", func(c *fiber.Ctx) error {
    c.Response().Header.Add("Cache-Time", "6000")
    return c.SendString("hi")
})
```

### Compress

> Compression middleware for Fiber that will compress the response using `gzip`, `deflate` and `brotli` compression depending on the Accept-Encoding header.

> Import the middleware package that is part of the Fiber web framework

```go
import (
  "github.com/gofiber/fiber/v2"
  "github.com/gofiber/fiber/v2/middleware/compress"
)
```

> After you initiate your Fiber app, you can use the following possibilities:

```go
// Default middleware config
app.Use(compress.New())

// Provide a custom compression level
app.Use(compress.New(compress.Config{
    Level: compress.LevelBestSpeed, // 1
}))

// Skip middleware for specific routes
app.Use(compress.New(compress.Config{
  Next:  func(c *fiber.Ctx) bool {
    return c.Path() == "/dont_compress"
  },
  Level: compress.LevelBestSpeed, // 1
}))
```

**Config**

```go
// Config defines the config for middleware.
type Config struct {
    // Next defines a function to skip this middleware when returned true.
    //
    // Optional. Default: nil
    Next func(c *fiber.Ctx) bool

    // CompressLevel determines the compression algoritm
    //
    // Optional. Default: LevelDefault
    // LevelDisabled:         -1
    // LevelDefault:          0
    // LevelBestSpeed:        1
    // LevelBestCompression:  2
    Level int
}
```

**Constants**

```go
// Compression levels
const (
    LevelDisabled        = -1
    LevelDefault         = 0
    LevelBestSpeed       = 1
    LevelBestCompression = 2
)
```

### CSRF

> CSRF middleware for Fiber that provides `Cross-site request forgery` **protection by passing a csrf token via cookies**. This cookie value will be used to compare against the client csrf token on requests, other than those defined as "safe" by RFC7231 (GET, HEAD, OPTIONS, or TRACE).

> When the csrf token is invalid, this middleware will return the `fiber.ErrForbidden` error. When no \_csrf cookie is set, or the token has expired, a new token will be generated and \_csrf cookie set.

> Import the middleware package that is part of the Fiber web framework

```go
import (
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/csrf"
)
```

> After you initiate your Fiber app, you can use the following possibilities:

```go
// Initialize default config
app.Use(csrf.New())

// Or extend your config for customization
app.Use(csrf.New(csrf.Config{
    KeyLookup:      "header:X-Csrf-Token",
    CookieName:     "csrf_",
    CookieSameSite: "Strict",
    Expiration:     1 * time.Hour,
    KeyGenerator:   utils.UUID,
    Extractor:      func(c *fiber.Ctx) (string, error) { ... },
}))
```

> Note: KeyLookup will be ignored if Extractor is explicitly set.

**Config**

```go
// Config defines the config for middleware.
type Config struct {
    // Next defines a function to skip this middleware when returned true.
    //
    // Optional. Default: nil
    Next func(c *fiber.Ctx) bool

    // KeyLookup is a string in the form of "<source>:<key>" that is used
    // to create an Extractor that extracts the token from the request.
    // Possible values:
    // - "header:<name>"
    // - "query:<name>"
    // - "param:<name>"
    // - "form:<name>"
    // - "cookie:<name>"
    //
    // Ignored if an Extractor is explicitly set.
    //
    // Optional. Default: "header:X-CSRF-Token"
    KeyLookup string

    // Name of the session cookie. This cookie will store session key.
    // Optional. Default value "_csrf".
    CookieName string

    // Domain of the CSRF cookie.
    // Optional. Default value "".
    CookieDomain string

    // Path of the CSRF cookie.
    // Optional. Default value "".
    CookiePath string

    // Indicates if CSRF cookie is secure.
    // Optional. Default value false.
    CookieSecure bool

    // Indicates if CSRF cookie is HTTP only.
    // Optional. Default value false.
    CookieHTTPOnly bool

    // Indicates if CSRF cookie is requested by SameSite.
    // Optional. Default value "Lax".
    CookieSameSite string

    // Decides whether cookie should last for only the browser sesison.
    // Ignores Expiration if set to true
    CookieSessionOnly bool

    // Expiration is the duration before csrf token will expire
    //
    // Optional. Default: 1 * time.Hour
    Expiration time.Duration

    // Store is used to store the state of the middleware
    //
    // Optional. Default: memory.New()
    Storage fiber.Storage

    // Context key to store generated CSRF token into context.
    // If left empty, token will not be stored in context.
    //
    // Optional. Default: ""
    ContextKey string

    // KeyGenerator creates a new CSRF token
    //
    // Optional. Default: utils.UUID
    KeyGenerator func() string

    // Extractor returns the csrf token
    //
    // If set this will be used in place of an Extractor based on KeyLookup.
    //
    // Optional. Default will create an Extractor based on KeyLookup.
    Extractor func(c *fiber.Ctx) (string, error)
}
```

## Reference

- [Fiber official docs](https://gofiber.io/#)
