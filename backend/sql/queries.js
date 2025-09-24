
//LOGIN QUERY
exports.loginSql= "SELECT * FROM user WHERE username= ?  LIMIT 1";

// REGISTER QUERY
exports.registerSql=" INSERT INTO web (site, username , password, status ) VALUES (?, ?, ?, ?)";

exports.chckSite = " SELECT * FROM web WHERE site = ? LIMIT 1";

//UPDATE QUERY
exports.updateSql="UPDATE web SET site = ?, username = ? , password = ?, status = ? WHERE id = ? ";

//DELETE QUERY
exports.deleteSql="DELETE FROM web WHERE id = ? ";

//LOGS DATA INSERT QUERY
exports.logSql = "INSERT INTO logs(event, description, ip, x_forward_ip, browser, os, user_id, time) VALUES (?,?,?,?,?,?,?,?) ";

//FETCH ALL DATA FROM DATABASE
exports.dataSql= "SELECT * FROM web";

//FETCH ONE QUERY
exports.fetchSql = 'SELECT id , site, username, password, status FROM web WHERE id =? LIMIT 1'; 