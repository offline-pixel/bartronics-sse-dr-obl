
async function getFilteredIsbns({ genre, author, year }, redisClient) {
    const filters = [];
    // Case: No filters → return everything from the index
    if (!genre && !author && !year) {
      return await redisClient.sMembers('extracts:isbn:index');
    }
  
    // Get all ISBNs first
    const allIsbns = await redisClient.sMembers('extracts:isbn:index');
    
    // Get all book data in one pipeline
    const pipeline = redisClient.multi();
    allIsbns.forEach(isbn => pipeline.get(`extract:${isbn}`));
    const booksRaw = await pipeline.exec();
  
    // Filter books based on criteria
    const filteredIsbns = booksRaw
      .map(val => {
        try {
          return val ? JSON.parse(val) : null;
        } catch (e) {
          return null;
        }
      })
      .filter(book => {
        if (!book) return false;
        // Genre filter (case insensitive)
        if (genre && !book.genre.toLowerCase().includes(genre.toLowerCase())) {
          return false;
        }
        // Author filter (case insensitive and ignore suffixes)
        if (author) {
          const authorName = book.author.replace(/\s[a-z]$/i, '').toLowerCase();
          const searchAuthor = author.toLowerCase();
          if (!authorName.includes(searchAuthor)) {
            return false;
          }
        }
        // Year filter (match publication year)
        if (year) {
          const pubYear = new Date(book.publicationDate).getFullYear().toString();
          if (pubYear !== year) {
            return false;
          }
        }
        return true;
      })
      .map(book => book.isbn);
    return filteredIsbns;
}

module.exports = { getFilteredIsbns }