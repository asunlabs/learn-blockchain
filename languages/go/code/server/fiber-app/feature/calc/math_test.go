package calc_test

import (
	"fiber-app/feature/calc"
	"fmt"
	"testing"
)

type AddData struct {
	x,y uint
	output uint
}

func TestAdd(t *testing.T) {
	result := calc.Add(4, 7)

	if result != 11 {
		t.Error()
	} else {
		fmt.Println("TestAdd passed")
	}

	addData := []AddData {
		{ x: 1, y: 2 , output: 3},
		{ x: 4, y: 9 , output: 13},
	}

	var _output uint
	for _, datum := range addData {
		_output = calc.Add(datum.x, datum.y)
		if (_output != datum.output) {
			t.Error("Multiple data add test failed")
		} 
	}
	
}

func TestSub(t *testing.T) {
	result := calc.Sub(10, 8)

	if result != 2 {
		t.Errorf("%d is a not correct value", result)
	}
}
