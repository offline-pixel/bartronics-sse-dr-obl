// For me bandwidth is more sensitive over computing
// For me Security is always on top
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const compression = require('compression');

const { corsOptions } = require('./config/config');
const { fetchAndStoreAllExtracts } = require('./utils/data-creator');
const { cloneAndMultiplyExtracts } = require('./utils/dataAugmenter');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(compression()); // compression saved 130kb/pagination

// Enable CORS with your configuration
app.use(cors(corsOptions));

// Use your routes
app.use('/api', routes);

(async () => {
  await fetchAndStoreAllExtracts(); // Fetch originals
  await cloneAndMultiplyExtracts(3); // Create 3x more
})();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// ws connection can also be created between client and
// server which can send updates to client to update on indexedDN for better optimization