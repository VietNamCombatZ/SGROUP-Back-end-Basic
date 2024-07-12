const conn = require("../database/connection.js");
const validateToken = require("../middleware/validateToken.js");
const nodemailer = require("nodemailer");
const mailService = require("../middleware/forgotPass.js");
// const storage = require("../database/uploadFile.js");

const secret = "your-64-byte-random-string-generated-above";

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");

const app = express();
const bodyParser = require("body-parser");

const port = 3000;

app.use(bodyParser.json());

app.post("/page/register", async (req, res) => {
  try {
    var username = req.body.username;
    var pass = req.body.pass;
    var mail = req.body.mail;
    var hashedPass = await hashPassword(pass);

    await insertInfo(username, hashedPass, mail);
    res.status(200).send({ username, pass });
    // res.redirect("/page/getAllInfo");
  } catch (err) {
    res.status(500).send("Internal server error");
    console.log("Failed to execute", err);
  }
});

app.post("/page/login", async (req, res) => {
  //Get username, pass from request
  const { username, pass } = req.body;
  // console.log(req.body);
  try {
    console.log(secret);
    //Get login username, pass from database
    const results = await conn.query(
      "SELECT id, username, pass FROM user_db WHERE username = ?",
      [username]
    );
    // console.log(results);

    //If no matches info, retrun 400 (missing info)
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(pass, user.pass);

    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: "30m",
    });
    res.send(token);
    // res.redirect("/page/getAllInfo");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error from server" });
  }
});

// app.get("/page/getAllInfo", validateToken, async (req, res) => {
//   const allUsers = conn.query("select * from user_db");
//   res.status(200).json(allUsers);
// });

app.post("/page/forgot-pass", async (req, res) => {
  try {
    const userEmail = req.body.mail;
    if (!userEmail) {
      return res.status(400).send("Email is required");
    }

    // var [user] = await conn.query(
    //   "SELECT email FROM user_db where email = ?",
    //   [userEmail]
    // );
    // console.log(user);
    // if(user == []){
    //   return res.status(404).send("Email not available");
    // }

    const secretKey = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(secretKey)
      .digest("hex");

    const passwordResetExpiration = new Date(Date.now() + 10 * 60 * 1000);
    console.log(passwordResetToken);
    console.log(passwordResetExpiration);

    await conn.query(
      "update user_db set token = ?, tokenExpiration = ? where email = ?",
      [passwordResetToken, passwordResetExpiration, userEmail]
    );

    if (userEmail) {
      await sendMail({
        from: "ForgotPass@gmail.com",
        to: userEmail,
        subject: "Reset Password",
        text: "Here is your reset password token: " + passwordResetToken,
      });

      return res.status(200).send("Reset pass email sent, pls check your mail");
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Error while executing forgot password function");
  }
});

const sendMail = async (option) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "merlin95@ethereal.email",
      pass: "Aq5pdmuahMGBSckXaQ",
    },
  });

  const emailOptions = {
    from: option.from,
    to: option.to,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(emailOptions);
};

app.post("/page/reset-pass", async function (req, res) {
  try {
    const mail = req.body.mail;
    const passwordResetToken = req.body.token;
    const newPass = req.body.newpass;

    //Get user from DB if match email, token, and time hasn't expired
    const [user] = await conn.query(
      "SELECT  * FROM user_db WHERE email = ? and passwordResetToken=? and passwordResetExpiration >= ?",
      [mail, passwordResetToken, new Date(Date.now())]
    );
    console.log(new Date(Date.now()));
    console.log(user);

    //User not available -> return err
    if (!user) {
      return res.status(400).send("Invalid email or token");
    }

    //Create salt to add to hashed pass
    var salt = crypto.randomBytes(32).toString("hex");
    var hashedPassword = crypto
      .pbkdf2Sync(newPass, salt, 13, 64, `sha512`)
      .toString(`hex`);

    var check = await updateUser(mail, hashedPassword);
 
    console.log(check);

    if (check) {
      return res.status(200).send("Changed password");
    } else {
      return res.status(404).send("Can't changed password");
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Error while executing forgot password function");
  }
});

async function updateUser(email, pass) {
  try {
    await conn.query(
      "update user_db set pass = ?, passwordResetToken=NULL, passwordResetExpiration = NULL where email = ? ",
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("check");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

// Single file
app.post("/page/single", uploadStorage.single("file"), (req, res) => {
  console.log(req.file);
  return res.send("Single file");
});
//Multiple files
app.post("/page/multiple", uploadStorage.array("file", 10), (req, res) => {
  console.log(req.files);
  return res.send("Multiple files");
});

// // Single file
// app.post("/page/single", storage.uploadStorage.single("file"), (req, res) => {
//   console.log(req.file);
//   return res.send("Single file");
// });
// //Multiple files
// app.post(
//   "/page/multiple",
//   storage.uploadStorage.array("file", 10),
//   (req, res) => {
//     console.log(req.files);
//     return res.send("Multiple files");
//   }
// );

async function hashPassword(pass) {
  var hashPass = await bcrypt.hash(pass, 13);
  // console.log(hashPass);
  return hashPass;
}

async function insertInfo(username, pass, email) {
  try {
    conn.query(
      "INSERT INTO user_db (username, pass,email) VALUES (?, ?,?)",
      [username, pass, email],
      (err) => {
        console.log("Error while insert");
      }
    );
  } catch (err) {
    console.log("Error with server while insert", err);
  }
}

//ver1
async function isUserExist(username) {
  try {
    let [result] = await conn.query(
      "select * from user_db where username = ?",
      [username],
      (err) => {
        if (err) {
          console.err("Failed to check user available");
          return false;
        }
      }
    );

    if (result.length > 0) {
      console.log(result);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error while excute isUserExist");
    return false;
  }
}

async function getUserInfo(username) {
  try {
    var [result] = [];
    var check = await isUserExist(username);
    if (check) {
      [result] = conn.query(
        "select * from user_db where username = ?, pass = ?",
        [username, pass]
      );
    }
    return [result];
  } catch (err) {
    console.error("Error while executing getUserInfo");
  }
}

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
