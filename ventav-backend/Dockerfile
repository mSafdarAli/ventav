#Stage 1
FROM node:14-alpine as build-step
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.*json /usr/app/
RUN npm install
COPY . /usr/app/
EXPOSE 3000
CMD [ "npm", "start" ]