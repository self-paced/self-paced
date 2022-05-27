FROM golang:1.17-alpine

WORKDIR /go/src
COPY ./ma/app .

RUN apk add mysql mysql-client

RUN apk upgrade --update && \
    apk --no-cache add git

RUN go get -u github.com/cosmtrek/air && \
    go build -o /go/bin/air github.com/cosmtrek/air

CMD ["air", "-c", ".air.toml"]
