// import bcrypt, { hash } from 'bcrypt';
const bcrypt = require("bcrypt");

// var regisPass = document.getElementById("regis-pass");
var regisPass = "check"



async function hashPassword() {
    var hashPass = await bcrypt.hash(regisPass, 13);
    console.log(hashPass);

}

hashPassword();


