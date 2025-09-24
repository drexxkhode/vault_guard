const express = require("express");
const db = require("../configs/db");
const { dataSql } = require("../sql/queries");

const fetchData = express.Router();

fetchData.get("/", (req, res, next) => {   // include next here
  db.query(dataSql, (err, results) => {
    if (err) {
      return next(err);  // pass error to Express error handler
    }

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "No available data" });
    }
  });
});

module.exports = fetchData;
