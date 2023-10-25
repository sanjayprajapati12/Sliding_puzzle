const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose")
// import mongoose from "mongoose" if you want to use all like this then change type to module 
// const { Server } = require('http');
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

connectDB();

const users = require("./routes/user");
const app = express();


const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const cor = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cor(corsOptions)); // Use this after the variable declaration

app.use("/", users);
const PORT = process.env.PORT ;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
)