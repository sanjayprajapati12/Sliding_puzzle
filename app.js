const express = require("express");
var cors = require("cors");
const connectDB = require("./config/db");

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
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on ${BASE_URL}`
  )
);
