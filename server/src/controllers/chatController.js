const chatService = require('../services/chatService');

exports.sendMessage = (io, socket, { text, name }) => {
  const msg = chatService.post(socket.id, name, text);
  io.emit('chat_message', msg);
};

exports.fetchHistory = (socket) => {
  socket.emit('chat_history', chatService.history());
};