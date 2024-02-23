const { Thought, User } = require('../models');

module.exports = {
  async getThought(req, res) {
    try {
      const thoughts = await Thought.find({})
        .select('-__v');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but found no User with that ID' });
      }

      res.json('Created the thought 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thoughts with this id!' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Deletes a User from the database. Looks for a User by ID.
  // Then if the user exists, we look for any friends associated with the user based on the user ID and update the friends array for the User.
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!deletedThought) {
        return res.status(404).json({
          message: 'No thoughts found with this ID!',
        });
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const {reactionBody, username} = req.body

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $push: { reactions: { reactionBody, username } } }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No thought with this ID' });
      }

      res.json({ message: 'Reaction successfully added!', updatedThought });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const reactionId = req.body.reactionId

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $pull: { reactions: { _id: reactionId } } },
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No reaction with this ID!' });
      }

      res.json({ message: 'Reaction successfully deleted!', updatedThought });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};
