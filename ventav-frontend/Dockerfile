FROM node:14-alpine AS builder

WORKDIR /app

COPY . .

RUN npm i && npm run build:ssr

FROM node:14-alpine


RUN npm i -g pm2

WORKDIR /app

RUN mkdir dist

COPY --from=builder /app/dist /app/dist

CMD ["pm2-runtime", "dist/ventav/server/main.js"]