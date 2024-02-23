const router = require('express').Router();
const {
  getThought,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// /api/Thoughts
router.route('/')
  .get(getThought)
  .post(createThought);

// /api/Thoughts/:ThoughtId
router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

router.route('/:thoughtId/reactions')
  .post(addReaction)
  .delete(deleteReaction);

module.exports = router;
