const pollSocket = require('./pollSocket');
const chatSocket = require('./chatSocket');
const pollService = require('../services/pollService');

exports.initSockets = (io) => {
  io.on('connection', socket => {
    console.log(`🖇️  Connected: ${socket.id}`);
    pollSocket(io, socket);
    chatSocket(io, socket);
    const active = pollService.getActive();
    // console.log(active)
    if (active) {
      // console.log("firstly", active);
      io.emit("new_poll", active.toJSON()); // ✅ safe
    }
    socket.on('disconnect', () => console.log(`❌ Disconnected: ${socket.id}`));
  });
};