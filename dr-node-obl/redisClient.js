const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379' // adjust if using Docker/cloud
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
