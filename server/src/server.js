const http = require('http');
const app = require('./app');
require('dotenv').config();
const { initSockets } = require('./sockets/index.js');
const { port } = require('./config');
const connectDB = require("./config/db"); 


const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed
    methods: ['GET', 'POST'],
  },
});

connectDB();

initSockets(io);

server.listen(port, () => console.log(`🚀 Server listening on port ${port}`));