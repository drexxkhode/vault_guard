const express = require("express");
const db = require("../configs/db");
const update = express.Router();
const { updateSql } = require("../sql/queries");
// WINSTON (LOGS)
const logger = require("../utils/logger");

update.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password, status } = req.body;

    db.query(updateSql, [site, username, password, status, id], (error, results) => {
      if (error) {
        logger.error(error); // log error
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.affectedRows > 0) {
        return res.status(200).json({ message: "Update successful" });
      } else {
        return res.status(404).json({ message: "No record found to update" });
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Something went wrong.." });
  }
});

module.exports = update;
