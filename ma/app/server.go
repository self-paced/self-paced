package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/super-studio/ecforce_ma/graph"
	"github.com/super-studio/ecforce_ma/graph/generated"
  "github.com/super-studio/ecforce_ma/external"
  "github.com/rs/cors"
)

const defaultPort = "8080"

// main
func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
  
  db := external.ConnectDatabase()
  srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{DB: db,}}))

  c := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:3010", "http://localhost:8080", "http://localhost:3005"},
    //AllowedOrigins:   []string{"*"},
    AllowCredentials: true,
  })

 	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", c.Handler(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
