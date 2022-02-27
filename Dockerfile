FROM node:16

WORKDIR /usr/src/app

ARG WEB_PORT

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${WEB_PORT}

CMD ["node", "server.js"]
