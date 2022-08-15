package ginkgo_app

type Person struct {
	Age int
}

func (p *Person) IsChild() bool {
	return p.Age < 18
}
