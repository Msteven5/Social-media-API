const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
    },
    createdAt: {
      // get: value => new Date
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true
    },
    reactions: [Reaction]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
