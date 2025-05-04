# How to proceed
1. First please install node and serve the application as it will help in getting a warm up for the server to create the database(Around ~20Sec)
2. Once Server is up, we can use the front-end

## Performance Features
- **Compression** enabled via `compression` middleware saves up to 130 KB per response.
- **Redis** used for fast lookup and caching (raw extract = ~74 KB, reduced = ~4 KB).
- **Lazy loading** and **pagination** on the backend to minimize frontend load.
- **Pre-fetching and augmentation** of data on startup to reduce external API calls.
- **Dark theme Support** Working in the night with lights off? Your system theme will apply automatically.
- **Re-usable Components** We have used re-usable componets as much as possible even in this tiniest app.

# Open Book Library Backend API - NODE/REACT

![Redis Performance](https://img.shields.io/badge/Redis-Optimized-red)
![Compression](https://img.shields.io/badge/Compression-130kb%2Freq-success)
![Security](https://img.shields.io/badge/Security-CORS%20%2B%20Validation-brightgreen)

A performant, secure, and bandwidth-conscious Node.js backend for serving open book library from Pan Macmillan. This backend is designed with modularity, maintainability, and efficient data access using Redis.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **Redis** (caching and fast lookups)
- **Axios** (external data fetching)
- **Compression** (bandwidth optimization)
- **CORS** (security and cross-origin access)

---

## Folder Structure

```txt
dr-node-obl/
├── server.js                 # Main entry point
├── package.json              # Project metadata and dependencies
├── config/
│   └── config.js             # CORS and external URLs
│   └── genres.js             # Static genre list
├── routes/
│   └── routes.js             # Express route definitions
├── controllers/
│   └── booksController.js    # Core logic for /books, /genres, /:isbn
├── utils/
│   ├── async.js              # Async error handler wrapper
│   ├── pagination.js         # Pagination logic
│   ├── filters.js            # Filtering by genre, year, author
│   ├── data-creator.js       # Fetch original extracts
│   └── dataAugmenter.js      # Clone & multiply data
├── redisClient.js            # Redis connection
```

---

## Getting Started with node

### 1. Clone and Install

```bash
git clone https://github.com/offline-pixel/bartronics-sse-dr-obl.git
cd bartronics-sse-dr-obl/dr-node-obl
npm install
```

### 2. Start Redis

Ensure you have Redis running locally (or update the connection in `redisClient.js`):

```bash
redis-server
```

### 3. Run the Server

```bash
npm start
```

---

## API Endpoints

### `GET /api/books`

List books with pagination and filters.

**Query Parameters:**

| Param   | Type     | Description                     |
|---------|----------|---------------------------------|
| page    | Number   | Page number (default: 1)        |
| limit   | Number   | Items per page (default: 10)    |
| genre   | String   | Filter by genre                 |
| author  | String   | Filter by author                |
| year    | String   | Filter by publication year      |

### `GET /api/books/:isbn`

Fetch full book extract by ISBN.

### `GET /api/genres`

Returns the static list of genres available for filtering.

---

---

## Security Practices

- CORS restricted via `corsOptions`.
- Redis errors handled gracefully.
- Async route handling using a wrapper to avoid try-catch clutter.

---

## WebSocket Support (Optional)

You can enable `WebSocket` server integration for syncing updates to clients (e.g. IndexedDB caching updates).

---

## Sample Redis Utility

```js
const redisClient = require('./redisClient');

redisClient.set('extract:12345', JSON.stringify({ title: "Sample Book" }));
```

---

## Evaluation Criteria

| Area                      | Notes                                                              |
|---------------------------|--------------------------------------------------------------------|
| Code Readability       | Modular folders and named exports                                 |
| System Design          | Redis caching, fetch/clone system, optional WebSocket             |
| API Design             | RESTful, paginated, filterable endpoints                          |
| Frontend Usability     | Small response size, lazy loading enabled                         |
| Bandwidth Optimization | Compression + filtered fields                                     |
| Security               | CORS, Redis error handling, JSON parsing guards                   |
| Git Hygiene            | Encourage meaningful commits and structured PRs                   |

---

## Sample `.env` (Optional)

```
PORT=3001
REDIS_URL=redis://localhost:6379
EXTERNAL_BOOK_SOURCE=https://external-api.com/pan-macmillan
```

---


## Getting Started with react

### 1. Clone(Already done that in previous) and Install

```bash
# from root folder
cd bartronics-sse-dr-obl/dr-react-obl
npm install
```

### 2. Run the React.js

```bash
npm run start
```

---


## Contributors

- Deepak Ranolia
- Redis, Express, and Axios Open Source Authors ❤️

---

## License

MIT License – free to use, share, and modify.

