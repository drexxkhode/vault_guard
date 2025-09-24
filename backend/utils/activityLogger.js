const UaParser = require("ua-parser-js");
const db = require("../configs/db");
const {logSql} = require('../sql/queries');
const logger = require("./logger");

function activityLogger (eventType, description, forcedUserId = null){
 return async function (req,res,next) {
    try {
        
const ip = req.ip;
const parser = new UaParser(req.headers['user-agent']); 
const XF_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
const browser2 = req.useragent.browser;
const result = parser.getResult();
const browser = `${result.browser.name || browser2} ${result.browser.version || ""}`.trim();
const os = `${result.os.name || "unknown"} ${result.os.version || ""}`.trim(); 

let userId = forcedUserId ||(req.session?.user?.id ?? "unknown");

const logData ={
    eventType,
    description,
    ip,
    XF_ip,
    browser,
    os,
    userId,
    time: new Date()
};

logger.info (logData);

await db.promise().query(logSql,[
    logData.eventType,
    logData.description,
    logData.ip,
    logData.XF_ip,
    logData.browser,
    logData.os,
    logData.userId,
    logData.time
]);
    } catch (err) {
        logger.error('logging error' + err.message);
    }
    next();
 };
}

module.exports = activityLogger;