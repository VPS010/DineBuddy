FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

FROM node:23-alpine

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

RUN if [ -f package-lock.json ]; then npm ci --only=production; fi

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.opencontainers.image.source="https://github.com/vps010/servit"
