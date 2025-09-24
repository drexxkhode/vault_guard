const express = require('express');
const fetchOne = express.Router();
const db = require("../configs/db");
const { fetchSql, dataSql } = require('../sql/queries');
fetchOne.get('/:id', async (req, res, next)=>{
const {id} = req.params;
db.query(fetchSql, [id], async (err, result)=>{
if (err) return next(err);
if(result.length>0){
 return res.status(200).json({result});
}else{
return res.status(404).json({message: 'site not found'});
}
});
});

module.exports = fetchOne;