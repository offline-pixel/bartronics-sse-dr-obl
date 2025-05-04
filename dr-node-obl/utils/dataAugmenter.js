const { v4: uuidv4 } = require('uuid');
const redisClient = require('../redisClient');
const genres = require('../config/genres');

function getModifiedExtract(original, suffix) {
  const newIsbn = `${original.isbn}-${suffix}`;
  const newTitle = `${original.title} (${suffix})`;
  const newAuthor = `${original.author} ${suffix}`;
  const newYear = parseInt(original.publishedYear) + Math.floor(Math.random() * 5);
  const genre = genres[Math.floor(Math.random() * genres.length)];

  return {
    ...original,
    isbn: newIsbn,
    title: newTitle,
    author: newAuthor.toLowerCase(),
    publishedYear: newYear,
    genre: genre.toLowerCase(),
  };  
}
async function cloneAndMultiplyExtracts(multiplier = 3, minThreshold = 240) {
    const totalIsbns = await redisClient.sCard('extracts:isbn:index');
  
    if (totalIsbns >= minThreshold) {
      console.log(`Cloning skipped. Found ${totalIsbns} records (>= ${minThreshold}).`);
      return;
    }
  
    const baseIsbns = await redisClient.sMembers('extracts:isbn:index');
    const ttl = 7 * 24 * 60 * 60;
  
    for (const isbn of baseIsbns) {
      const raw = await redisClient.get(`extract:${isbn}`);
      if (!raw) continue;
  
      const original = JSON.parse(raw);
  
      for (let i = 0; i < multiplier; i++) {
        const suffix = String.fromCharCode(65 + i); // A, B, C
        const modified = getModifiedExtract(original, suffix);
  
        const key = `extract:${modified.isbn}`;
        await redisClient.setEx(key, ttl, JSON.stringify(modified));
        await redisClient.sAdd('extracts:isbn:index', modified.isbn);
        await redisClient.sAdd(`genre:${modified.genre.toLowerCase()}`, modified.isbn);
        await redisClient.sAdd(`author:${modified.author.toLowerCase()}`, modified.isbn);
        await redisClient.sAdd(`year:${modified.publishedYear}`, modified.isbn);

      }
    }
  
    console.log(`Cloning complete. Added ${baseIsbns.length * multiplier} more records.`);
}

module.exports = {
  cloneAndMultiplyExtracts,
};
