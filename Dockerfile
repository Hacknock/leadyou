FROM node:16

WORKDIR /usr/src/app

ARG WEB_PORT

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g

COPY ./app .

EXPOSE ${WEB_PORT}

CMD ["pm2-runtime", "server.js"]
