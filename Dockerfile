FROM golang:1.18.3-alpine3.16

RUN apk update && apk add git && apk add --no-cache alpine-sdk build-base

RUN mkdir /go/src/app

WORKDIR /go/src/app

ADD ./app /go/src/app

EXPOSE ${WEB_PORT}

# CMD ["go", "run", "server.go"]
CMD ["go", "test", "-v", "./..."]
