const winston = require ("winston");
require('winston-daily-rotate-file');

const TCP = new winston.transports.DailyRotateFile({
filename: "logs/vaultguard-app%DATE%.log",
datePattern:" YYYY-MM-DD",
zippedArchive: true,
maxSize: "20m",
maxFiles: "14d"
});

const logger = winston.createLogger({
level: "info",
format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()

),
transports : [
    TCP
]
});

module.exports=logger;