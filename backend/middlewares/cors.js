const corsMiddleware = require("cors");

const cors = corsMiddleware({
  origin: "https://vault-guard.onrender.com",
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'Content-Type', 'Authorization', 'Accept']
});

module.exports = cors;
