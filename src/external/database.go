package external

import (
  "os"
  "fmt"
  "log"
  
  "github.com/super-studio/ecforce_ma/graph/model"
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
  "github.com/joho/godotenv"
)

// .env読み込み
func loadEnv() {

  err := godotenv.Load(".env")
  if err != nil {
    fmt.Printf("読み込み出来ませんでした: %v", err)
  }
  message := os.Getenv("LOADING_MESSAGE")

  fmt.Println(message)
}

// DB接続
func ConnectDatabase() *gorm.DB {
  loadEnv()
  
  HOST    := os.Getenv("DB_HOST")
  USER    := os.Getenv("DB_ROLE")
  PASS    := os.Getenv("DB_PASSWORD")
  DBNAME  := os.Getenv("DB_NAME")
  PORT    := os.Getenv("DB_PORT")
  TZ      := os.Getenv("DB_TZ")
 
  dsn     := "host="+HOST+" user="+USER+" password="+PASS+" dbname="+DBNAME+" port="+PORT+" sslmode=disable TimeZone="+TZ
  db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

  if err != nil {
    log.Fatalf("failed to create new schema, error: %v", err.Error())
  }

  db.AutoMigrate( &model.Account{}, &model.AccountUser{})

  fmt.Println("db connected: ", &db)
  return db
}

