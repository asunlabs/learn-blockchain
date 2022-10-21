# Test

> Testing your application is done with the Test method. Use this method for creating \_test.go files or when you need to debug your routing logic. The default timeout is 1s if you want to disable a timeout altogether, pass -1 as a second argument.

```go
func (app *App) Test(req *http.Request, msTimeout ...int) (*http.Response, error)
```

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
