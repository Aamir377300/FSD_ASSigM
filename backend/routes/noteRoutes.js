const express = require('express');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const { validateNote } = require('../middleware/validator');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validateNote, createNote)
  .get(getNotes);

router.route('/:id')
  .get(getNote)
  .put(validateNote, updateNote)
  .delete(deleteNote);

module.exports = router;
