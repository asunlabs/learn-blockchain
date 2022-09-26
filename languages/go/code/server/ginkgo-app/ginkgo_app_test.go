package ginkgo_app_test

import (
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"

	"ginkgo-app"
)

var _ = Describe("GinkgoApp", func() {
	It("Should be true", func ()  {
		person := ginkgo_app.Person{Age: 33}
		Expect(person.IsChild()).To(BeTrue())
		
	})
})
