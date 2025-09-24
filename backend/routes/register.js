const express = require("express");
const db = require("../configs/db");
const register = express.Router();
const logger = require("../utils/logger");
const { registerSql, chckSite } = require("../sql/queries");

register.post("/", (req, res, next) => {
  const { site, username, password, status } = req.body;

  if (!site || !username || !password || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // First check if site exists
  db.execute(chckSite, [site], (err, result) => {
    if (err) return next(err);

    if (result.length > 0) {
      return res.status(409).json({ message: "Site already exists" }); // 409 Conflict is better
    }

    // Insert new site
    db.execute(registerSql, [site, username, password, status], (err, results) => {
      if (err) return next(err);

      if (results.affectedRows > 0) {
        return res.status(201).json({ message: "Site registered" });
      } else {
        return res.status(500).json({ message: "Unable to add site" });
      }
    });
  });
});

module.exports = register;
