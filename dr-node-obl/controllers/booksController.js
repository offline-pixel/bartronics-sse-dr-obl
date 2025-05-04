const redisClient = require('../redisClient');
const genres = require('../config/genres');
const asyncHandler = require('../utils/async');

const { getPagedData }  = require('../utils/pagination');
const { getFilteredIsbns }  = require('../utils/filters');

const getBooks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, genre, author, year } = req.query;
    const isbns = await getFilteredIsbns({ genre, author, year }, redisClient);
    const pagedIsbns = getPagedData(isbns, page, limit);

    const pipeline = redisClient.multi();
    pagedIsbns.forEach((isbn) => pipeline.get(`extract:${isbn}`));

    const booksRaw = await pipeline.exec();
    const books = booksRaw
      .map((val) => {
        if (!val) return null;
        try {
          const parsed = JSON.parse(val); // this is 74kb data / paginations
          return {
            isbn: parsed.isbn,
            title: parsed.title,
            author: parsed.author,
            genre: parsed.genre,
            authorBiography: parsed.authorBiography,
            publicationDate: parsed.publicationDate,
            jacketUrl: parsed.jacketUrl
          };  // this is 4kb data / paginations
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    res.json({
      page: Number(page),
      totalItems: isbns.length,
      totalPages: Math.ceil(isbns.length / limit),
      data: books,
    });
});

const getBookById = asyncHandler(async (req, res) => {
  const { isbn } = req.params;
  const raw = await redisClient.get(`extract:${isbn}`);
  if (!raw) return res.status(404).json({ message: 'Book not found' });

  const parsed = JSON.parse(raw);
  res.json({
    ...parsed
  });
});

const getGenres = asyncHandler(async (req, res) => {
  res.json({ genres }); // front-end has virtual dom in select box here...
});

module.exports = {
  getBooks,
  getBookById,
  getGenres,
};
