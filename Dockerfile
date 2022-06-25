FROM golang:1.18.3-alpine3.16

RUN apk update && apk add git && apk add --no-cache alpine-sdk build-base

RUN mkdir /go/src/app

WORKDIR /go/src/app

ADD ./app /go/src/app

RUN go get github.com/go-sql-driver/mysql

EXPOSE ${WEB_PORT}
