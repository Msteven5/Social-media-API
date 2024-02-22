const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate({ path: 'thoughts', select: '-__v' },
          { path: 'friends', select: '-__v' })


      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts', select: '-__v' },
          { path: 'friends', select: '-__v' })

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { upsert: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Deletes a User from the database. Looks for a User by ID.
  // Then if the user exists, we look for any friends associated with the user based on the user ID and update the friends array for the User.
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      const updatedUser = await User.updateMany(
        { friends: req.params.userId },
        { $pull: { friends: req.params.userId } },
      );

      const deletedThoughts = await Thought.deleteMany({ userId: req.params.userId });

      if (!updatedUser) {
        return res.status(404).json({
          message: 'User created but no user with this id!',
        });
      }

      if (!deletedThoughts) {
        return res.status(404).json({
          message: 'User deleted but they had no thoughts!',
        });
      }

      res.json({ message: 'User successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async addFriend(req, res) {
    try {
      const user = await User
    }
  }
};
