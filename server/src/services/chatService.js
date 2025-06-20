const ChatRepository = require('../repositories/chatRepository');
const Message = require('../models/message');

class ChatService {
  post(senderId, senderName, text) {
    const message = new Message({ senderId, senderName, text });
    ChatRepository.add(message);
    return message;
  }

  history() {
    return ChatRepository.getAll();
  }
}

module.exports = new ChatService();