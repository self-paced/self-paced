package main

import (
	"log"
  "fmt"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
  "github.com/super-studio/ecforce_ma/graph"
  "github.com/super-studio/ecforce_ma/graph/generated"

  "github.com/jinzhu/gorm"
  _ "github.com/jinzhu/gorm/dialects/mysql"

  //graphql "github.com/graph-gophers/graphql-go"
  //"github.com/graph-gophers/graphql-go/relay"
)

type query struct{}
const defaultPort = "8080"

func (_ *query) Hello() string { return "Hello, world!" }

type User struct {
  ID int `gorm:"primary_key; not null"`
  Name string `gorm:"type:varchar(50); packanot null"`
  Age string `gorm:"type:varvahr(10);packanot null"`
}

func connect() *gorm.DB {
  DBMS := "mysql"
  USER := "root"
  PASS := "root"
  PROTOCOL := "tcp(db:3306)"
  DBNAME := "go_db"
  CONNECT := USER + ":" + PASS + "@" + PROTOCOL + "/" + DBNAME
  db, err := gorm.Open(DBMS, CONNECT) 

  if err != nil {
    log.Fatalf("failed to create new schema, error: %v", err.Error())
  }

  db.Set("gorm:table_options", "ENGINE=InnoDB")
  db.SingularTable(true)
  db.AutoMigrate(&User{})

  fmt.Println("db connected: ", &db)
  return db  
}

func getUser() [] User {
  db := connect()
  var user []User
  db.First(&user)
  defer db.Close()

  return user
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

  results := getUser()
  fmt.Println(results)

  db := connect()
  db.LogMode(true)
  
  //schema := graphql.MustParseSchema(s, &query{})  

	//srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	//http.Handle("/", playground.Handler("GraphQL playground", "/query"))
  //http.Handle("/query", &relay.Handler{Schema: schema})
	//http.Handle("/query", srv)
  
  srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

  http.Handle("/", playground.Handler("GraphQL playground", "/query"))
  http.Handle("/query", srv)

  log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
  log.Fatal(http.ListenAndServe(":"+port, nil))
  
}
