const mysql = require("mysql2");
const express = require("express");
require("dotenv").config();

console.log(process.env.DB_HOST);

const conn = mysql.createConnection({
  host: process.env.DB_HOST, //localhost hoac IP
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}).promise();


  conn
    .connect()
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
    });


module.exports = conn;
