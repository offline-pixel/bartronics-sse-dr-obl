// Config.js
module.exports = {
  corsOptions: {
    origin: ['http://localhost:3000', 'https://example.com', 'https://another-domain.com'],
    methods: 'GET',
  },
  externalUrl: 'https://extracts.panmacmillan.com/getextracts?titlecontains=s',
};