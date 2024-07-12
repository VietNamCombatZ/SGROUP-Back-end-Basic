const conn = require("../database/connection.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const multer = require("multer");
const nodemailer = require("nodemailer");

const middleware = require("../middleware/forgotPass.js");

require("dotenv").config();

//!!! Can't use env variable
const secret = "your-64-byte-random-string-generated-above";
const tokenLifetime = "30m";

const hashPassword = async (pass) => {
  var hashPass = await bcrypt.hash(pass, 13);
  // console.log(hashPass);
  return hashPass;
};

const insertInfo = async (username, pass, email) => {
  try {
    conn.query(
      "INSERT INTO user_db (username, pass,email) VALUES (?, ?,?)",
      [username, pass, email],
      (err) => {
        console.log("Error while insert");
        return err;
      }
    );
    return true;
  } catch (err) {
    console.log("Error with server while insert", err);
    return err;
  }
};

const validateUser = async (username, pass) => {
  try {
    // console.log("check1");
    const [results] = await conn.query(
      "SELECT id, username, pass FROM user_db WHERE username = ?",
      [username]
    );
    //  console.log("check2");
    //  console.log(results);

    //If no matches info, retrun 400 (missing info)
    //  console.log(results.length == 0);
    if (results.length == 0) {
      return false;
    }

    const user = results[0];
    //  console.log(user);
    //  console.log(user.pass);
    //  console.log(pass);
    const isMatch = await bcrypt.compare(pass, user.pass);

    //  console.log(isMatch);
    if (!isMatch) {
      return false;
    }
    //  console.log(secret);

    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: tokenLifetime,
    });
    console.log(token);
    return { token, tokenLifetime };
  } catch (err) {
    return err;
  }
};

const insertToken = async (username, token, expiresTime) => {
  try {
    conn.query(
      "UPDATE user_db SET  token =? , tokenExpiration = ?  where username = ?",
      [token, expiresTime, username],
      (err) => {
        console.log("Error while insert");
        return err;
      }
    );
    return true;
  } catch (err) {
    console.log("Error with server while insert", err);
    return err;
  }
};

const forgotPass = async (email) => {
  try {
    if (!email) {
      return false;
    }

    // const secretKey = crypto.randomBytes(32).toString("hex");
    // console.log(secretKey);
    // const passwordResetToken = crypto.createHash("sha256").update(secretKey).digest("hex");

    const passwordResetToken = jwt.sign({ mail: email }, secret, {
      expiresIn: tokenLifetime,
    });
    const passwordResetExpiration = new Date(Date.now() + 1000 * 60 * 30);

    await conn.query(
      "UPDATE user_db SET token = ?, tokenExpiration = ? WHERE email = ?",
      [passwordResetToken, passwordResetExpiration, email]
    );

    await middleware.sendMail({
      from: "ForgotPass@gmail.com",
      to: email,
      subject: "Reset Password",
      text: "Here is your reset password token: " + passwordResetToken,
    });

    return true;
  } catch (error) {
    console.error("Error in forgotPass: ", error); // Log the error for debugging
    return false;
  }
};

const resetPass = async (email, token, newPass) => {
  //Get user from DB if match email, token, and time hasn't expired
  const [user] = await conn.query(
    "SELECT  * FROM user_db WHERE email = ? and token=? and tokenExpiration >= ?",
    [email, token, new Date(Date.now())]
  );
  console.log(new Date(Date.now()));
  console.log(user);

  //User not available -> return err
  if (!user) {
    return false;
  }

  //Create salt to add to hashed pass
  // var salt = crypto.randomBytes(32).toString("hex");
  // var hashedPassword = crypto
  //   .pbkdf2Sync(newPass, salt, 13, 64, `sha512`)
  //   .toString(`hex`);
  const hashedPassword = await hashPassword(newPass);

  var check = await updateUser(email, hashedPassword);

  console.log(check);

  if (check) {
    return true;
  } else {
    return false;
  }
};

async function updateUser(email, pass) {
  try {
    await conn.query(
      "update user_db set pass = ?, token=NULL, tokenExpiration = NULL where email = ? ",
      [pass, email],
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  hashPassword,
  insertInfo,
  validateUser,
  insertToken,
  forgotPass,
  resetPass,
  updateUser,
};
