const UAParser = require("ua-parser-js");
  const useragent = require("express-useragent");
const logger = require("../service/logger");
const db = require("../db");

function activityLogger(eventType, description, forcedUserId=null) {
  return async function (req, res, next) {
    try {
      // Make sure you have: app.set("trust proxy", true) in server.js
      const clientIp = req.ip; 
      const forwardedFor = req.headers["x-forwarded-for"] || "";
      const Browser2 = req.useragent.browser;
      // Parse with ua-parser-js
      const parser = new UAParser(req.headers["user-agent"]);
      const result = parser.getResult();

      const browser = `${result.browser.name || Browser2} ${result.browser.version || ""}`.trim();
      const os = `${result.os.name || "Other"} ${result.os.version || ""}`.trim();

      let userId = forcedUserId || ( req.session?.user?.id ?? "Anonymous");
      
      const logData = {
        eventType,
        description,
        clientIp,
        forwardedFor,
        browser,
        os,
        userId,
        time: new Date(),
      };

      logger.info(logData);

      const sql =
        "INSERT INTO logs (event_type, description, ip, forwarded_for, browser, os, user_id, time) VALUES (?,?,?,?,?,?,?,?)";

      await db.promise().query(sql, [
        logData.eventType,
        logData.description,
        logData.clientIp,
        logData.forwardedFor,
        logData.browser,
        logData.os,
        logData.userId,
        logData.time,
      ]);
    } catch (err) {
      logger.error("Logging Error " + err.message);
    }
    next();
  };
}

module.exports = activityLogger;
