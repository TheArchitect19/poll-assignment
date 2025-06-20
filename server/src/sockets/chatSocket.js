const chatController = require('../controllers/chatController');

module.exports = (io, socket) => {
  socket.on('chat_message', data => chatController.sendMessage(io, socket, data));
  socket.on('chat_history', () => chatController.fetchHistory(socket));
};