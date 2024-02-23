const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find()
      .populate([
        { path: 'thoughts', select: '-__v' },
        { path: 'friends', select: '-__v' }
      ]);


      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      .populate([
        { path: 'thoughts', select: '-__v' },
        { path: 'friends', select: '-__v' }
      ]);

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

      const deletedThoughts = await Thought.deleteMany({ username: req.body.username });

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
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, friends: { $ne: friendId } },
        { $push: { friends: friendId } }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user with this ID or friend already in the friends list!' });
      }

      res.json({ message: 'Friend successfully added!', updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, friends: friendId },
        { $pull: { friends: friendId } }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No user with this ID or friend already removed!' });
      }

      res.json({ message: 'Friend successfully deleted!', updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};
