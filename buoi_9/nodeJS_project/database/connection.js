const mysql = require("mysql2");
const express = require("express");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12341234",
  database: "buoi_10",
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
