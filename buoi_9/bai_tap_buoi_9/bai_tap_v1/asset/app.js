// import bcrypt, { hash } from 'bcrypt';
const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12341234",
  database: "buoi_9",
});

function connection() {
  conn.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("Connected to database successfully");
  });
}


var regisBtn = document.getElementById("regis_btn");
var loginBtn = document.getElementById("login_btn");



async function hashPassword() {
  connection();
  var regisPass = document.getElementById("regis_pass").value;
  var regisUsername = document.getElementById("regis_user").value;
  
  var hashPass = await bcrypt.hash(regisPass, 13);
  insertInfo(regisUsername, regisPass);
}

async function insertInfo(username, pass) {
  try{
     conn.query(
    "insert into user_db(username, pass) value (?,?)",
    [username, pass],
    (err) => {
      if (err) {
        console.error("Failed to insert new user info");
      }
    }
  );
  

  }
  catch(err){
    console.error("Error while excute");
  }
  
}

async function isUserExist(username) {
  try{
let [result] =conn.query("select * from user_db where username = ?", [username], (err) => {
    if (err) {
      console.err("Failed to check user available");
    }
  });

  if(result.length > 0){
    return true;
  }
  else{
    return false;
  }
  }
  catch(err){
     console.error("Error while excute");
     return false;
  }
  
}
async function getUserInfo(username, pass){
  try{
    var [result] =[];
    if(isUserExist(username)){
      [result] = conn.query("select * from user_db where username = ?, pass = ?",
        [username, pass]
      )
    }
    return [result];
  }
  catch(err){
    console.error("Error while executing");
  }
}

//check if login username and pass match with one in database

async function isMatchInfo(username, pass){
  try{var userInfoDB = getUserInfo(username,pass);
  if(userInfoDB.username == username && userInfoDB.pass == pass){
    return true
  }
  else{
    return false
  }}
  catch(err){
    console.error("Error while executing");
  }
}

async function redirectPage(){
  try {
    var loginUsername = document.getElementById("login_user").value;
    var loginPass = document.getElementById("login_pass").value;
    
    if(isMatchInfo(loginUsername, loginPass)){
      console.log("Login successfully");

    }

  } catch (error) {
    console.error("Error while executing");
  }
}

regisBtn.addEventListener("click", hashPassword);
loginBtn.addEventListener("click", redirectPage);
