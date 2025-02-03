FROM node:23-alpine

WORKDIR /app

COPY package.json .

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm","start"]

LABEL org.opencontainers.image.source https://github.com/vps010/servit
