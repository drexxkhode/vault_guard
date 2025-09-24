const winston = require ("winston");
require("winston-daily-rotate-file"); 

const transport = new winston.transports.DailyRotateFile({
    filename: "logs/app-log-%DATE%.log",
    dateFormat: "YYYY-MM-DD",
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
    transports: [

        transport
    ]
    

});

module.exports= logger;