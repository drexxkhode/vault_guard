// session.js
// Handles session management routes

const express = require("express");

//EXPRESS SESSION
const sessionRoute = express.Router();

sessionRoute.get("/", (req,res)=>{
  if(req.session.user){
   return  res.json({isLoggedIn: true, user: req.session.user});
  }
  else{
    return res.status(403).json({isLoggedIn: false});
  }
});
module.exports = sessionRoute;
