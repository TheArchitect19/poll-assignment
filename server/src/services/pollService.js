const PollRepository = require('../repositories/pollRepository');
const Poll = require('../models/poll');

class PollService {
  create(question, options, answers ,duration) {
    const id = Date.now().toString();
    const poll = new Poll(id, question, options,answers, duration);
    PollRepository.saveActive(poll);
    // console.log(this.getActive());
    return poll;
  }

  answer(socketId, pollId, answer) {
    const poll = PollRepository.getActive();
    console.log("answering poll", poll, socketId, pollId, answer);
    if (!poll || poll.id !== pollId) throw new Error('No matching active poll');
    if (poll.answers[socketId]) throw new Error('Already answered');
    poll.answers[socketId] = answer;
    return poll;
  }

  end() {
    const poll = PollRepository.getActive();
    if (!poll) return null;
    clearTimeout(poll.timer);
    PollRepository.clearActive();
    return poll;
  }

  getHistory() {
    return PollRepository.getHistory();
  }

  getActive() {
    // console.log("firstly", PollRepository.getActive());
    return PollRepository.getActive();
  }
}

module.exports = new PollService();