const express = require("express");
const db = require("../configs/db");
const deleteRoute = express.Router();
const {deleteSql} = require("../sql/queries");
const logger = require("../utils/logger");
const activityLogger = require("../utils/activityLogger");

deleteRoute.delete("/:id", async (req,res)=>{
try {
    const {id} = req.params;
 db.query(deleteSql, [id], async (err, result)=>{
if(err) return res.status(500).json({message: " Internal server error "});

if(result.affectedRows> 0){
    const userId = req.session?.user?.id;
    const username = req.session?.user?.username;
    const ToUpperUsername = username ? username.toUpperCase() : '';
    activityLogger("DELETE", `ID ${id} DELETED BY ${ToUpperUsername}`, userId)(req,res,()=>{});
    return res.status(200).json({message: "delete successful"});
}else{
   
    return res.status(404).json({message: " Nothing found to delete "});
}

});

} catch (error) {
    return res.status(403).json({message: " Unable to delete "});
}
});
 module.exports= deleteRoute;