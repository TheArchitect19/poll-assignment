class Message {
    constructor({ senderId, senderName, text, timestamp = Date.now() }) {
      this.senderId = senderId;
      this.senderName = senderName;
      this.text = text;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = Message;