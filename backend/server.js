//EXPRESS
const express = require("express");

// CSRF INC
const crsf = require ("csurf");
csrfProtection =  crsf();

//MORGAN 
const morgan = require("morgan");

//ENVIRONMENT VARIABLE INC
require("dotenv").config();

//EXPRESS SESSION
const session = require("./configs/session");

//EXPRESS RATE LIMIT
const limiter = require("./middlewares/rateLimit");

//EXPRESS USERAGENT
const useragent = require ("express-useragent");

//CORS
const cors = require("./middlewares/cors");

//WINSTON (LOGS)
const logger = require("./utils/logger");

// HELMENT 
const helmet= require("./middlewares/helmet");

// GLOBAL ERROR MIDDLEWARE
const errors = require ("./middlewares/errors");

// LOGIN ROUTE
const login = require("./routes/login");

// DELETE ROUTE
const deleteRoute =  require("./routes/delete");

// UPDATE ROUTE
const update = require("./routes/update");

//SESSION ROUTE 
const sessionRoute = require("./routes/session");

//LOGOUT ROUTE
const logout = require("./routes/logout");

//REGISTER ROUTE
const register = require("./routes/register");

//FETCH DATA ROUTE
const fetchData = require("./routes/fetcher");

//SESSION AUTHENTICATE
const isAuthenticated = require("./controllers/auth");

//CSRF-TOKEN
const csrfRoute = require("./middlewares/crsf");

//JOI VALIDATION
const validate  = require("./utils/joi");
const registrationSchema = require("./schema/joi");

//UPDATE FETCH ONE SITE
const updateFectch = require('./routes/updateFetch');

//EXPRESS STATUS MONITOR 
const status = require("express-status-monitor");

// APP PORT 
const PORT = process.env.PORT || 5000 ;

// EXPRESS APP
const app = express();

// JSON
app.use(express.json({limit: "10mb"}));

//FORMS
app.use(express.urlencoded({extended:false }));

//EXPRESS USERAGENT GLOBAL USAGE
app.use(useragent.express());

//EXPRESS STATUS MONITOR USAGE
app.use(status());

//CORS USAGE
app.use(cors);

//HELMET USAGE 
app.use(helmet);

//MORGAN USAGE
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}
//SESSION CONFIG USAGE
app.use(session);

//CSRF TOKEN ENDPOINT USAGE
app.use("/csrf-token", csrfProtection, csrfRoute);

//LOGIN ENDPOINT USAGE
app.use("/login",limiter, csrfProtection, login );

//DELETE ENDPOINT USAGE
app.use("/delete",isAuthenticated, deleteRoute);

//UPDATE ENDPOINT USAGE
app.use('/update', isAuthenticated, update);

//SESSION ENDPOINT USAGE
app.use("/session",sessionRoute);

//LOGOUT ENDPOINT USAGE
app.use("/logout", logout);

//REGISTER ENDPOINT USAGE
app.use("/register",isAuthenticated, register);

//FETCH ALL DATA ENDPOINT USAGE
app.use("/data", isAuthenticated, fetchData);

//FETCH ONE SITE ENDPOINT USAGE
app.use('/fetch', updateFectch);

// GLOBAL ERROR USAGE 
app.use(errors);

//APP PORT USAGE
app.listen(PORT, ()=>{
console.log(`Server running on http://localhost:${PORT}`);
console.log(`App status on http://localhost:${PORT}/status`);

});
