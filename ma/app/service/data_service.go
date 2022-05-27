package data

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"
	// "github.com/super-studio/ecforce_ma/graph/model"
)

func ListEcforce() {
	fmt.Println("db: ")
}

func RandomString(n int) string {

	var strings string
	dt := time.Now()
	unix := dt.Unix()
	strings = strconv.FormatInt(unix, 10) + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	var letter = []rune(strings)
	b := make([]rune, n)
	for i := range b {
		b[i] = letter[rand.Intn(len(letter))]
	}
	return string(b)
}
