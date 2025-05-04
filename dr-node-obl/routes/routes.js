const express = require('express');

const { getBooks, getBookById, getGenres, } = require('../controllers/booksController');
const router = express.Router();

router.get('/books', getBooks);
router.get('/books/:isbn', getBookById);
router.get('/genres', getGenres);

module.exports = router;
