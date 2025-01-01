// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// import dotenv from 'dotenv'

// dotenv.config({
//     path: './.env'
// })


const app = express();

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());


// routes

// import userroutes from './routes/user.routes.js'
const userroutes = require('./routes/user.routes.js');
const adminroutes = require('./routes/admin.routes.js');

app.use("/api/user",userroutes)
app.use("/api/admin",adminroutes)

module.exports = { app };

// export { app }