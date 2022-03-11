
```
docker-compose build
docker-compose up
````

## migration
export DB_HOST=127.0.0.1
export GODB_MYSQL='mysql://root:root@tcp(go_mysql:3382)/go_db'
migrate -path db/migrations/. -database ${GODB_MYSQL} up