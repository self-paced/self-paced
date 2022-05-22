FROM node:16.13.0-slim

WORKDIR /app

ENV NPM_VERSION=8.5.5

RUN npm i -g npm@${NPM_VERSION}

COPY . .

RUN npm ci \
    && npm run build:app

CMD [ "npm", "run", "start:app" ]