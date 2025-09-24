const express = require("express");
const db = require("../configs/db");
const activityLogger = require("../utils/activityLogger");
const logger = require("../utils/logger");
const logout = express.Router();

logout.post("/", (req, res) => {
  if (!req.session || !req.session.user) {
    activityLogger("LOGOUT", `UNKNOWN USER LOGGED OUT`)(req, res, () => {});
    return res.status(200).json({ message: "Already logged out" });
  }

  // ✅ Capture before destroying
  const { id: userId,  username } = req.session.user;
const ToUpperUsername = username ? username.toUpperCase() : ''; 
  req.session.destroy(err => {
    if (err) {
      logger.error("Session destruction error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    // Pass userId to activityLogger explicitly
    activityLogger("LOGOUT", `${ToUpperUsername} LOGGED OUT`, userId)(req, res, () => {});

    res.clearCookie(process.env.KEY);
    return res.status(200).json({ message: "Logout Success" });
  });
});

module.exports = logout;
