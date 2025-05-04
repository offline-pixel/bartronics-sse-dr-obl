const express = require('express');
const axios = require('axios');
const { externalUrl } = require('../config/config');
const redisClient = require('../redisClient');
const genres = require('../config/genres');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// make sure its also commented in server.js cloneAndMultiplyExtracts(3).catch(console.error);
async function deleteAllExtractKeys() {
    const patterns = [
        'extract:*',
        'extracts:isbn:index',
        'genre:*',
        'author:*',
        'year:*',
        'page:*:fetched',
        'page:*:nextUrl'
      ];
    const CHUNK_SIZE = 100;
  
    for (const pattern of patterns) {
      let keys = await redisClient.keys(pattern);
      if (!keys.length) {
        console.log(`No keys found for pattern: ${pattern}`);
        continue;
      }
  
      console.log(`Found ${keys.length} keys for pattern: ${pattern}`);
  
      for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
        const chunk = keys.slice(i, i + CHUNK_SIZE);
  
        // Await each deletion batch explicitly
        const deleteResults = await Promise.all(
          chunk.map((key) => redisClient.del(key))
        );
  
        const deletedCount = deleteResults.reduce((sum, res) => sum + res, 0);
        console.log(`Deleted ${deletedCount} keys from pattern: ${pattern}`);
      }
    }
  }
  
function normalizeKey(value) {
  return value?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}
  
async function fetchAndStoreAllExtracts() {
  // await deleteAllExtractKeys();

  let nextUrl = `${externalUrl}&pagenumber=1`;
  const ttl = 7 * 24 * 60 * 60;

  try {
    while (nextUrl) {
      const pageNumber = new URL(nextUrl).searchParams.get('pagenumber');
      const pageHistoryKey = `page:${pageNumber}:fetched`;
      const pageFetched = await redisClient.get(pageHistoryKey);

      if (pageFetched) {
        console.log(`Page ${pageNumber} already fetched, skipping...`);
        const nextPageUrl = await getNextPageUrl(pageNumber);
        if (!nextPageUrl) {
          console.log(`No next page found for page ${pageNumber}, ending.`);
          break;
        }
        nextUrl = nextPageUrl;
        continue;
      }

      try {
        const res = await axios.get(nextUrl);
        const extracts = res.data.Extracts || [];
        console.log(`Page ${pageNumber} fetched for data creation...`);
        console.log(`Total 21 pages (10 records each) available at the time of coding...`);

        function minifyHtml(html = '') {
          return html
            .replace(/\n/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
        }

        for (const item of extracts) {
          const genre = genres[Math.floor(Math.random() * genres.length)];

          const enriched = {
            ...item,
            genre,
            extractHtml: minifyHtml(item.extractHtml),
            authorBiography: minifyHtml(item.authorBiography),
          };

          const publishedYear = item.publicationDate
            ? new Date(item.publicationDate).getFullYear().toString()
            : 'unknown';

          await redisClient.setEx(`extract:${item.isbn}`, ttl, JSON.stringify(enriched));
          await redisClient.sAdd('extracts:isbn:index', item.isbn);
          await redisClient.sAdd(`genre:${genre.trim().toLowerCase()}`, item.isbn);
          await redisClient.sAdd(`author:${item.author.trim().toLowerCase()}`, item.isbn);
          await redisClient.sAdd(`year:${publishedYear}`, item.isbn);
        }

        await redisClient.setEx(pageHistoryKey, ttl, 'true');

        const nextPageUrl = res.data.NextPageUrl;
        if (nextPageUrl) {
          try {
            const resolvedUrl = new URL(nextPageUrl, externalUrl).href;
            const nextPageNum = new URL(resolvedUrl).searchParams.get('pagenumber');
            if (nextPageNum) {
              await redisClient.setEx(`page:${nextPageNum}:nextUrl`, ttl, resolvedUrl);
            }
            nextUrl = resolvedUrl;
          } catch (err) {
            console.warn('Invalid NextPageUrl format, stopping fetch loop.');
            break;
          }
        } else {
          break;
        }

        await delay(250);
      } catch (innerErr) {
        console.error('Error fetching/storing a page:', innerErr.message);
        break;
      }
    }
  } catch (err) {
    console.error('Critical failure in fetch loop:', err.message);
  }
}

async function getNextPageUrl(pageNumber) {
  const nextPageUrlKey = `page:${Number(pageNumber) + 1}:nextUrl`;
  return await redisClient.get(nextPageUrlKey) || null;
}

module.exports = {
  fetchAndStoreAllExtracts
};
