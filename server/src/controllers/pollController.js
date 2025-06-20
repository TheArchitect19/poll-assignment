const pollService = require('../services/pollService');

exports.createPoll = (io, socket, { question, options, duration, correctAnswer }) => {
  if (pollService.getHistory().length && pollService.getHistory().slice(-1)[0].id) {}
  if (pollService.getActive()) {
    socket.emit('error', 'Active poll exists');
    return;
  }
  const poll = pollService.create(question, options, duration, correctAnswer);

  // schedule end
  poll.timer = setTimeout(() => {
    const ended = pollService.end();
    io.emit('poll_results', formatResults(ended));
  }, duration * 1000);

  io.emit('new_poll', { id: poll.id, question: poll.question, options: poll.options, correctAnswer: poll.correctAnswer, duration: poll.duration });
};

exports.answerPoll = (io, socket, { pollId, answer }) => {
  try {
    console.log(pollId, answer);
    const poll = pollService.answer(socket.id, pollId, answer);
    console.log("updated poll", poll);
    io.emit('live_update', computeCounts(poll));

    // if all have answered
    const total = io.engine.clientsCount;
    if (Object.keys(poll.answers).length >= total) {
      const ended = pollService.end();
      io.emit('poll_results', formatResults(ended));
    }
  } catch (e) {
    socket.emit('error', e.message);
  }
};

exports.getHistory = (socket) => {
  const history = pollService.getHistory().map(poll => formatResults(poll));
  socket.emit('past_polls', history);
};

function computeCounts(poll) {
  const counts = {};
  poll.options.forEach(o => counts[o] = 0);
  Object.values(poll.answers).forEach(ans => counts[ans]++);
  return { pollId: poll.id, counts };
}

function formatResults(poll) {
  return {
    pollId: poll.id,
    question: poll.question,
    results: poll.options.map(opt => ({ option: opt, votes: (poll.answers && Object.values(poll.answers).filter(v => v === opt).length) || 0 }))
  };
}

exports.getActivePoll = (socket) => {
  // get the current active poll (or null if none)
  console.log("listening for active poll");
  socket.emit('active-poll', pollService.getActive());
  return pollService.getActive();
};