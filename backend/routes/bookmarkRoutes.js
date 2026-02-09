const express = require('express');
const {
  createBookmark,
  getBookmarks,
  getBookmark,
  updateBookmark,
  deleteBookmark
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');
const { validateBookmark } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validateBookmark, createBookmark)
  .get(getBookmarks);

router.route('/:id')
  .get(getBookmark)
  .put(validateBookmark, updateBookmark)
  .delete(deleteBookmark);

module.exports = router;
