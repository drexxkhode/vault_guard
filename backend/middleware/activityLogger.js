const logger = require("../service/logger");
const db = require("../db");

function actLogger(event, description) {
  return async function (req, res, next) {
    try {
      // Make sure you have: app.set("trust proxy", true) in server.js
      const clientIp = req.ip; 
      const forwardedFor = req.headers["x-forwarded-for"] || "";
  const agent = req.useragent || {};
  const browser = agent.browser.toAgent() || "unknown";
   const os = agent.os.toString() || "unknown";

      let userId = "anonymous";
      if (req.session?.user?.id) {
        userId = req.session.user.id;
      }

      const logData = {
        event,
        description,
        clientIp,
        forwardedFor,
        browser,
        os,
        userId,
        time: new Date(),
      };

      logger.info(logData);

      const sql = `
        INSERT INTO logs 
        (event_type, description, ip, forwarded_for, browser, os, user_id, time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.promise().query(sql, [
        logData.event,
        logData.description,
        logData.clientIp,
        logData.forwardedFor,
        logData.browser,
        logData.os,
        logData.userId,
        logData.time,
      ]);
    } catch (err) {
      logger.error("Logging error: " + err.message);
    }
    next();
  };
}

module.exports = actLogger;
