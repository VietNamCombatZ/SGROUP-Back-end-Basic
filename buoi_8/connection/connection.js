// import mysql from 'mysql2';
const mysql = require("mysql2");
// import express from "express";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12341234",
  database: "S_usermnmt",
});

function connection() {
  conn.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("Connected to database successfully");
  });
}

// const connection   = conn.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("Connected to database successfully");
// });

function getAllUser() {
  conn.query("select * from users", (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result);
  });
}

const newUser = {
  firstname: "Huy_D",

  username: "melicom4",
  email: "email4",
  password: "12345678",
};

const checkID = 3;

// const updatedInfo ={
//   firstname: "Huy_Luff",

//   username: "Name7",
//   email:"email7",
//   password: "pass7",

// }

async function insertNewUser() {
  conn.query(
    "insert into users(username, email, password, fullName) values (?, ?, ?,?) ",
    [newUser.username, newUser.email, newUser.password, newUser.firstname],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

async function getUserByID(ID) {
  try {
    var [result] = await conn
      .promise()
      .query("select * from users where id = ?", [ID], (err) => {
        if (err) {
          console.log(err);
        }
      });
    if (result.length > 0) {
      console.log(result);
      return true;
    } else {
      console.log("No matches ID");
      return false;
    }
  } catch (err) {
    console.log("Error while execute");
    return false;
  }
}

async function updateUserByID(ID, updatedInfo) {
  try {
    if (!getUserByID(ID)) {
      console.log("No matches ID");
      return;
    }

    await conn
      .promise()
      .query(
        "Update users set username = ?, email = ?, password = ?, fullName = ? where id =  ?",
        [
          updatedInfo.username,
          updatedInfo.email,
          updatedInfo.password,
          updatedInfo.firstname,
          ID,
        ]
      );
  } catch (err) {
    console.log("Error while execute");
  }
}

async function deleteUserByID(ID) {
  try {
    if (!getUserByID(ID)) {
      console.log("No matches ID");
      return;
    }

    await conn.promise().query("delete from users where id =  ?", [ID]);
  } catch (err) {
    console.log("Error while execute");
  }
}

// const insertNewUser = conn.query("")

module.exports = {
  connection,
  getAllUser,
  getUserByID,
  insertNewUser,
  updateUserByID,
  deleteUserByID,
};
