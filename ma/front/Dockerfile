FROM node:16

ENV APP /app
RUN mkdir $APP
WORKDIR $APP

COPY package.json package-lock.json $APP/
RUN yarn

COPY . $APP/

CMD ["yarn", "dev"]
