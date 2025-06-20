class Poll {
    constructor(id, question, options, duration, answers, correctAnswer) {
      this.id = id;
      this.question = question;
      this.options = options;
      this.duration = duration;
      this.start = Date.now();
      this.answers = {};
      this.timer = null;
      this.correctAnswer=correctAnswer
    }

    toJSON() {
      return {
        id: this.id,
        question: this.question,
        options: this.options,
        duration: this.duration,
        answers: this.answers,
        correctAnswer: this.correctAnswer,
        // timer: this.timer,
        // start: this.start
      };
    }
  }
  
  module.exports = Poll;