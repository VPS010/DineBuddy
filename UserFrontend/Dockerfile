FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:23-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
