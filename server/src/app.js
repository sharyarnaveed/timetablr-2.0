
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv=require("dotenv")
const compression = require('compression');
const helmet = require("helmet");
const xss = require('xss-clean');
const rateLimit = require("express-rate-limit");
dotenv.config({
    path: './.env'
})


const app = express();
app.use(xss());   
app.use(helmet());
app.use(compression());
app.use(
    cors({
        origin: true,
        credentials: true
    })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 70, 
});
app.use(limiter);
app.disable("x-powered-by");
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());


// routes

// import userroutes from './routes/user.routes.js'
const userroutes = require('./routes/user.routes.js');
const adminroutes = require('./routes/admin.routes.js');

app.use("/api/user",userroutes)
app.use("/api/admin",adminroutes)

module.exports = { app };

// export { app }