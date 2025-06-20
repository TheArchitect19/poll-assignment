const pollController = require('../controllers/pollController');



module.exports = (io, socket) => {
  socket.on('create_poll', data => pollController.createPoll(io, socket, data));
  socket.on('answer_poll', data => pollController.answerPoll(io, socket, data));
  socket.on('get_past_polls', () => pollController.getHistory(socket));
  // const active = pollService.getActive();
  // if (active) {
  //   console.log("firstly", active);
  //   socket.emit("new_poll", active.toJSON());
  // }
};