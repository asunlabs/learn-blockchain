package ginkgo_app_test

import (
	ginkgo_app "ginkgo-app"
	"log"
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestGinkgoApp(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "GinkgoApp Suite")
}

var _ = Describe("Person.IsChild()", func () {
	AfterEach(func ()  {
		log.Print("Logged!")
	})

	XContext("when the person is a child", func ()  {
		It("Returns true", func ()  {
			person := ginkgo_app.Person{ Age: 10 }
			response := person.IsChild()

			Expect(response).To(Equal(true))
		})
	})

	XContext("when the person is not a child", func ()  {
		It("Returns false", func ()  {
			person := ginkgo_app.Person{ Age: 20 }
			response := person.IsChild()

			Expect(response).To(Equal(false))
		})
		

		XIt("Skips a test", func ()  {
			log.Print("skipped test")
		})
	})

	DescribeTable("is child table test", func (age int, expectedResponse bool)  {
		p := ginkgo_app.Person{ Age: age}

		Expect(p.IsChild()).To(Equal(expectedResponse))
	}, 
	Entry("when is a child", 18, true),
	Entry("when is a child", 18, false))
})

