const express = require("express");
csrfRoute = express.Router();

csrfRoute.get("/", (req, res)=>{
  try {
    res.json( { csrfToken: req.csrfToken()});
  } catch (err) {
    console.log("CSRF token err", err);
    return res.status(500).json({error: "Could not gene"});
  }
});

module.exports = csrfRoute;