const useragent = require("useragent");
const logger = require("../service/logger");
const db = require("../db");

function actLogger(event, description) {
  return async function (req, res, next) {
    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const agent = useragent.parse(req.headers["user-agent"]);

      let userId = "anonymous";
      if (req.session?.user?.id) {
        userId = req.session.user.id;
      }

      const logData = {
        event,
        description,
        ip,
        browser: agent.toAgent(),
        os: agent.os.toString(),
        userId,
        time: new Date(),
      };

      logger.info(logData);

      const sql =
        "INSERT INTO logs (event_type, description, ip, browser, os, user_id, time) VALUES (?,?,?,?,?,?,?)";
      await db
        .promise()
        .query(sql, [
          logData.event,
          logData.description,
          logData.ip,
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
