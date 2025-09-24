const corsMiddleware = require("cors");

const cors = corsMiddleware({
  origin: "https://vaultguard-oa58.onrender.com", // must match your frontend!
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'Content-Type', 'Authorization', 'Accept']
});

module.exports = cors;
