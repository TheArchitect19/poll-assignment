FROM node:latest

WORKDIR /app

COPY . .
RUN npm install
RUN npm install -g nodemon


CMD ["nodemon", "src/server.js"]