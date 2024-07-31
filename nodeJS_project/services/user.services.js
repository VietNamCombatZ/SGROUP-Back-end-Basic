const conn = require("../database/connection.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const multer = require("multer");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const middleware = require("../middleware/middleware.js");
dotenv.config();      

//!!! Can't use env variable
const secret = "your-64-byte-random-string-generated-above";
const tokenLifetime = "30m";

const hashPassword = async (pass) => {
  
  try {
    var hashPass = await bcrypt.hash(pass, 13);

    return hashPass;
    
  } catch (err) {
    return err
  }
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
    const [results] = await conn.query(
      "SELECT id, username, pass FROM user_db WHERE username = ?",
      [username]
    );

    //If no matches info, retrun 400 (missing info)

    if (results[0].length == 0) {
      return false;
    }

    const user = results[0];
    console.log(user);

    const isMatch = await bcrypt.compare(pass, user.pass);

    if (!isMatch) {
      return false;
    }

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

const getAllUsers = async () => {
  try {
    // console.log("check1");
    const [userList] = await conn.query(
      "select username from user_db order by id asc"
    );
    // console.log(userList);
    return userList;
  } catch (err) {
    return err;
  }
};

const resetPass = async (email, token, newPass) => {
  //Get user from DB if match email, token, and time hasn't expired
  const [user] = await conn.query(
    "SELECT  * FROM user_db WHERE email = ? and token=? and tokenExpiration >= ?",
    [email, token, new Date(Date.now())]
  );
  // console.log(new Date(Date.now()));
  // console.log(user);

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


// Obj: title, username
const createPoll = async (obj) => {
  try {
    await conn.query(`INSERT INTO polls(title, user_create) VALUES (?, ?)`, [
      obj.title,
      obj.username,
    ]);
    return true;
  } catch (err) {
    console.log("Error at create poll ", err);
    return false;
  }
};


const deletePoll = async (id) => {
  try {
    // await conn.query(
    //   "DELETE FROM user_option WHERE option_id = ANY(SELECT id FROM options WHERE poll_id = ?)",
    //   [id]
    // );
    await conn.query(" DELETE FROM user_options WHERE poll_id = ? ", [id]);
    await conn.query("DELETE FROM options WHERE poll_id = ?", [id]);
    await conn.query(`DELETE FROM polls WHERE id = ?`, [id]);
    return true;
  } catch (err) {
    console.log("Error at deletePoll ", err);
    return false;
  }
};


//Obj: poll_id, option_id, option_title
const createOption = async (obj) => {
  try {
    //
    await conn.query(
      "insert into options (poll_id, option_id, option_title ) values (?,?,?)",
      [obj.poll_id, obj.option_id, obj.option_title]
    );

    return true;
  } catch (err) {
    console.log("Error at createOption ", err);
    return false;
  }
};


//Obj: username, poll_id, option_id
const vote = async (obj) => {
  try {
    // const person = await conn.query(
    //   `SELECT * FROM user_options WHERE username = ? AND option_id = ?`,
    //   [obj.username, obj.option_id]
    // );
    const person = await conn.query(
      "select * from user_options where username = ? and poll_id = ? and option_id = ?",
      [obj.username, obj.poll_id, obj.option_id]
    );

    if (person[0].length > 0) {
      return false;
    } else {
      conn.query(
        `INSERT INTO user_options(username,poll_id, option_id) VALUES (?, ?, ? )`,
        [obj.username, obj.poll_id, obj.option_id]
      );
      return true;
    }
  } catch (err) {
    console.log("Error at vote ", err);
    return false;
  }
};


//Obj: username, poll_id, option_id
const unVote = async (obj) => {
  try {
    await conn.query(
      `DELETE FROM user_options WHERE username = ? AND poll_id = ? and option_id = ?`,
      [obj.username, obj.poll_id, obj.option_id]
    );
    return true;
  } catch (err) {
    console.log("Error at unVote ", err);
    return false;
  }
};

const getVote = async (id) => {
  try {
    const poll = await conn.query("SELECT * FROM polls WHERE id = ?", [id]);

    // const getData = await conn.query(
    //   "select option_title, count(user_options.option_id) as voteCount from options left join user_options on options.option_id = user_options.option_id where options.poll_id = ? group by options.option_id",
    //   [id]
    // );

    // const getData = await conn.query(
    //   "SELECT options.option_title, COUNT(user_options.option_id) AS voteCount FROM options INNER JOIN user_options ON options.poll_id = user_options.poll_id where options.poll_id = ? GROUP BY options.option_id, options.option_title",
    //   [id]
    // );

    const getData = await conn.query(
      "SELECT  options.option_title, COUNT(user_options.option_id) AS voteCount FROM options INNER JOIN user_options ON options.poll_id = user_options.poll_id WHERE options.poll_id = ? GROUP BY options.option_id, options.option_title",
      [id]
    );

    let result = {
      title: poll[0][0].title,
      createdByUser: poll[0][0].user_create,
      options: getData[0].map((data) => ({
        option: data.option_title,
        voteCount: data.voteCount,
      })),
    };
    return result;
  } catch (err) {
    console.log("Error at getVote ", err);
    return false;
  }
};

module.exports = {
  hashPassword,
  insertInfo,
  validateUser,
  insertToken,
  getAllUsers,
  forgotPass,
  resetPass,
  updateUser,
  createPoll,
  deletePoll,
  createOption,
  vote,
  unVote,
  getVote,
};
