const corsMiddleware = require("cors");

const cors = corsMiddleware({
origin: "https://vault-guard.onrender.com",
credentials: true,
methods: ['GET', 'PUT', 'POST','DELETE'],
allowedHeaders: ['X-CSRF-Token']

});
module.exports= cors;