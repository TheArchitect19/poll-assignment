const Poll = require('../models/poll');
const PollModel = require("../models/Poll.mongo");

class PollRepository {
  constructor() {
    this.activePoll = null;
    this.pastPolls = [];
  }

  saveActive(poll) {
  
    this.activePoll = poll;
  }

  clearActive() {
    console.log("Clearing active poll:", this.activePoll);
    if (this.activePoll) {
      const poll = this.activePoll;

      const rawAnswers = Object.values(poll.answers);
      const totalVotes = rawAnswers.length;

      const percentageMap = new Map();

      poll.options.forEach(option => {
        const count = rawAnswers.filter(ans => ans === option).length;
        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        percentageMap.set(option, `${percent}%`);
      });
      poll.answers = percentageMap;

      const plainPoll = {
        id: poll.id,
        question: poll.question,
        options: poll.options,
        duration: poll.duration,
        createdAt: new Date(),
        answers: Object.fromEntries(percentageMap),
      };

      const dbPoll = new PollModel(plainPoll);
      dbPoll.save();
      this.activePoll = null;
    }
  }

  getActive() {
    return this.activePoll;
  }

  async getHistory() {
    return await PollModel.find();
  }

  async savePollManually(pollData) {
    const poll = new PollModel(pollData);
    await poll.save();
  }
}

module.exports = new PollRepository();