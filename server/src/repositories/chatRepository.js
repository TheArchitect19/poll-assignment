class ChatRepository {
    constructor() {
      this.messages = [];
    }
  
    add(message) {
      this.messages.push(message);
    }
  
    getAll() {
      return this.messages;
    }
  }
  
  module.exports = new ChatRepository();