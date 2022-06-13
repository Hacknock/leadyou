FROM golang:1.18.3-alpine3.16

RUN apk update && apk add git

RUN mkdir /go/src/app

WORKDIR /go/src/app

ADD ./app /go/src/app

EXPOSE ${WEB_PORT}

CMD ["go", "run", "server.go"]

# FROM node:16

# WORKDIR /usr/src/app

# ARG WEB_PORT

# COPY package*.json ./

# RUN npm install -g npm@8.5.2
# RUN npm cache verify

# ARG NODE_ENV
# RUN if [ "${NODE_ENV}" = "production" ]; then \
#   npm install --production; \
#   else \
#   npm install; \
#   fi

# RUN npm install -g pm2

# COPY ./app .

# EXPOSE ${WEB_PORT}

# CMD ["pm2-runtime", "server.js", "--max-memory-restart","250M"]
