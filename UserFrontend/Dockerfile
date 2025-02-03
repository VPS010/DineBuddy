FROM node:23-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173


CMD ["npm","run","dev"]


LABEL org.opencontainers.image.source https://github.com/vps010/servit
