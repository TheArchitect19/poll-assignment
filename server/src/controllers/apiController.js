const PollRepository = require("../repositories/pollRepository");

exports.getAllPolls = async (req, res) => {
  const polls = await PollRepository.getHistory();
  res.status(200).json(polls);
};

exports.createPoll = async (req, res) => {
  const poll = req.body;
  if (!poll.question || !poll.options) {
    return res.status(400).json({ error: "Invalid poll data" });
  }

  await PollRepository.savePollManually(poll);
  res.status(201).json({ message: "Poll saved to DB" });
};
