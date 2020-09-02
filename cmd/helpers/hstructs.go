package helpers

import (
	"fmt"
	"reflect"
	"strings"
)

func StructTags(structure interface{}) string {
	s := reflect.ValueOf(structure)
	var fields strings.Builder

	for i := 0; i < s.NumField(); i++ {
		var test = s.Type().Field(i).Tag.Get("db")
		fields.WriteString(test)

		if i < s.NumField()-1 {
			fields.WriteString(",")
		}
	}
	/*
		if reflect.TypeOf(fields.String()) != string {
			return nil
		}
	*/

	return fields.String()
}

func B2S(bs []uint8) string {
	b := make([]byte, len(bs))
	for i, v := range bs {
		b[i] = byte(v)
	}
	return string(b)
}

func B2M(bs []uint8) string {
	b := make([]byte, len(bs))

	for i, v := range bs {
		b[i] = byte(v)
	}

	fmt.Println(b)
	for _, nn := range b {
		fmt.Println(string(nn))
	}
	return string(b)
}
