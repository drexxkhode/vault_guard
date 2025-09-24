const rateLimit = require("express-rate-limit");
const activityLogger = require("../utils/activityLogger");

const limiter=rateLimit({
    windowMs: 1000 * 60 * 1,
    max: 5,
     handler: (req,res,next,options)=>{
const resetTime = Math.ceil(options.windowMs / 1000);
const retryAfter = res.getHeader('retry-After') || resetTime ;
activityLogger("BRUTE-FORCE ALERT", `BRUTE FORCE ALERT FROM IP ${req.ip}`)(req,res,()=>{});
res.status(options.statusCode).json({
status: 429,
retryAfter: retryAfter,
error: 'Too many request from this ip. Try again later',
message: `Try again after ${retryAfter} seconds`

});
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = limiter;