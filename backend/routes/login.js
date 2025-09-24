const express = require("express");
const db = require("../configs/db");
const login = express.Router();
const {loginSql} = require("../sql/queries");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const activityLogger = require("../utils/activityLogger");

login.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  const ToUpperUsername = username ? username.toUpperCase() : ""; // <--- moved here

  db.query(loginSql, [username], async (err, results) => {
    if (err) return next(err);

    if (results.length > 0) {
      try {
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          req.session.user = { id: user.id, username: user.username };
          console.log(req.session);
          console.log(req.session.user);
          activityLogger("LOGIN", `${ToUpperUsername} LOGGED IN`)(req, res, () => {});
          return res.status(200).json({ message: "Authorized" });
        } else {

          activityLogger("LOGIN ATTEMPT", `${ToUpperUsername} ATTEMPTED A LOGIN`)(req, res, () => {});
          return res.status(401).json({ message: "Unauthorized" });
        }
      } catch (err) {
        return next(err);
      }
    } else {
      activityLogger("UNKNOWN USER", `${ToUpperUsername} & ${password} ATTEMPTED TO LOGIN`)(req, res, () => {});
      return res.status(400).json({ message: "Unauthorized" });
    }
  });
});


module.exports = login;