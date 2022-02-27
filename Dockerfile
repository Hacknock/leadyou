FROM node:16

WORKDIR /usr/src/app

ARG WEB_PORT

COPY package*.json ./

RUN npm install -g npm@8.5.2
RUN npm cache verify

RUN npm install
RUN npm install -g forever

COPY ./app .

EXPOSE ${WEB_PORT}

CMD ["forever", "server.js"]
