
## migration
### create migration file
migrate create -ext sql -dir db/migrations -seq create_accounts

### migrate
migrate -path db/migrations/. -database ${GODB_POSTGRES} up
migrate -path db/migrations/. -database ${GODB_POSTGRES} down
