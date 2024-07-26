const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const conn = require("../database/connection.js");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

var MY_SECRET = process.env.MY_SECRET;

//reset password
const sendMail = async (option) => {
  // console.log("check");
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: parseInt(process.env.EMAIL_PORT, 10),
    auth: {
      user: "merlin95@ethereal.email",
      pass: "Aq5pdmuahMGBSckXaQ",
    },
  });

  const emailOptions = {
    from: "Test_Forgot_Pass<ForgotPass@gmail.com>",
    to: option.to,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(emailOptions);
};

const getUser = async (username) => {
  var [result] = await conn.query("select * from user_db where username = ?", [
    username,
  ]);
  return [result];
};

// async function validateToken (req,res) {
//    var {loginUsername, loginPass} = req.body;

//    var userInfo = await getUser(loginUsername);
//    if( userInfo.pass != loginPass){
//     return res.status(403).json({error: "Invalid login"});

//    }
//    delete userInfo.pass;

//    const token = jwt.sign(userInfo, MY_SECRET, {expiresIn: "5m"});

//    res.cookie("token", token, { httpOnly: true})
// }

var validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log(authHeader);
    // const token = req.header.authorization.token; //Can them buoc split
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);
    // const username = req.body.username;
    // const [user] = await conn.query(
    //   "SELECT  * FROM user_db WHERE username = ? and token=? and tokenExpiration >= ?",
    //   [username, token, new Date(Date.now())]
    // );

    const [user] = await conn.query(
      "SELECT  username FROM user_db WHERE token=? and tokenExpiration >= ?",
      [token, new Date(Date.now())]
    );

    console.log(user[0]);

    if (!user[0]) // nếu chỉ !user thì sẽ ko chạy vì user =[] vẫn thỏa ĐK
       {
        await conn.query(
          "update user_db set token =NULL, tokenExpiration = NULL where token = ?",[token]
        );
      console.log("checkToken");
      return res.status(404).send("Invalid token");
    }

    req.user = user[0];
    next();
  } catch (err) {
    console.log("Error at  middleware.validateToken: ", err);
    return res.status(400).send("Error at  middleware.validateToken: ", err);
  }
};

// async function validateToken(req, res) {
//   try {
//     var { loginUsername, loginPass } = req.body;

//     //Login username & pass missing
//     if (!loginUsername || !loginPass) {
//       return res
//         .status(400)
//         .json({ error: "Username and password are required" });
//     }

//     var userInfo = await getUser(loginUsername);
//     if (!userInfo) {
//       return res.status(403).json({ error: "Invalid login" });
//     }

//     if (userInfo.pass !== loginPass) {
//       // You should hash passwords and compare hashes instead
//       return res.status(403).json({ error: "Invalid login" });
//     }

//     delete userInfo.pass;

//     const token = jwt.sign(
//       { id: userInfo.id, username: userInfo.username },
//       MY_SECRET,
//       { expiresIn: "5m" }
//     );

//     res.cookie("token", token, { httpOnly: true });
//     return res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("check");
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const uploadStorage = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); //First need to create 2 folder: public/upload
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

//Postman: body -> form-data -> key: file (gõ thường toàn bộ)

const uploadSingleFile = uploadStorage.single("file");
const uploadMultipleFile = uploadStorage.array("file", 10);

//Vote - Poll

var isValidUser = async (username) => {
  try {
    const user = await conn.query("SELECT * FROM user_db WHERE username= ?", [
      username,
    ]);

    if (user[0].length == 0) {
      console.log("User is invalid");
      return false;
    }
    return true;
  } catch (err) {
    console.log("Error in isValidUser: ", err);
    return false;
  }
};

var isValidPollId = async (id) => {
  try {
    const poll = await conn.query("SELECT * FROM polls WHERE id = ?", [[id]]);

    if (poll[0].length == 0) {
      console.log("ID poll is invalid");
      return false;
    }
    return true;
  } catch (err) {
    console.log("Error in isValidPollId: ", err);
    return false;
  }
};

var isValidOptionId = async (poll_id, option_id) => {
  try {
    const options = await conn.query(
      "SELECT * FROM options WHERE poll_id =? and option_id = ?",
      [poll_id, option_id]
    );

    if (options[0].length == 0) {
      console.log("Option ID is invalid");
      return false;
    }
    return true;
  } catch (err) {
    console.log("Error in isValidOptionId: ", err);
    return false;
  }
};

const isPollVotedByUser = async (username, poll_id) => {
  try {
    const bool = await conn.query(
      "select * from user_options where username = ? and poll_id = ?",
      [username, poll_id]
    );

    if (bool[0].length == 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log("Error in isPollVotedByUser: ", err);
    return false;
  }
};

const createPoll = async (req, res, next) => {
  try {
    const obj = req.body;
    if (obj.title == null) {
      return res.status(404).send("Require poll title");
    }
    if (obj.username == null) {
      return res.status(404).send("Require username");
    }

    next();
  } catch (err) {
    console.log("Error at middleware: ", err);
    return res.status(400).send("Error at middleware: ", err);
  }
};

const deletePoll = async (req, res, next) => {
  try {
    let poll_id = req.params.id;

    let bool = await isValidPollId(poll_id);

    // console.log(bool);
    if (!bool) return res.status(400).send("Poll_id is not valid");

    return next();
  } catch (err) {
    console.log("Error at  middleware.deletePoll: ", err);
    return res.status(400).send("Error at  middleware.deletePoll: ", err);
  }
};

const createOption = async (req, res, next) => {
  try {
    const obj = req.body;

    const booleanPoll = await isValidPollId(obj.poll_id);
    if (!booleanPoll) {
      return res.status(400).send("Poll ID is invalid");
    }

    if (obj.title == "" || obj.option_id == "") {
      return res.status(400).send("Title or ID can't be empty");
    }

    const booleanOption = await isValidOptionId(obj.poll_id, obj.option_id);
    if (booleanOption) {
      return res.status(400).send("Option already exist");
    }
    next();
  } catch (err) {
    console.log("Error at  middleware.createOption: ", err);
    return res.status(400).send("Error at  middleware.createOption: ", err);
  }
};

const vote = async (req, res, next) => {
  try {
    let obj = req.body;

    if (!(await isValidUser(obj.username))) {
      return res.status(400).send("User is invalid");
    }

    if (!(await isValidPollId(obj.poll_id))) {
      return res.status(400).send("Poll is invalid");
    }

    if (!(await isValidOptionId(obj.poll_id, obj.option_id))) {
      return res.status(400).send("Option is invalid");
    }

    if (await isPollVotedByUser(obj.username, obj.poll_id)) {
      return res.status(404).send("Poll already voted by this user");
    }

    next();
  } catch (err) {
    console.log("Error at  middleware.vote: ", err);
    return res.status(400).send("Error at  middleware.vote: ", err);
  }
};

const unVote = async (req, res, next) => {
  try {
    const obj = req.body;
    // console.log(obj);

    let vote = await conn.query(
      "select * from user_options where username = ? and poll_id = ? and option_id = ?",
      [obj.username, obj.poll_id, obj.option_id]
    );

    if (vote[0].length == 0) {
      return res
        .status(400)
        .send(
          "No exist vote for option:" +
            obj.option_id +
            ", at poll" +
            obj.poll_id +
            ", by user:" +
            obj.username
        );
    }

    next();
  } catch (err) {
    console.log("Error at  middleware.unVote: ", err);
    return res.status(400).send("Error at  middleware.unVote: ", err);
  }
};

const getVote = async (req, res, next) => {
  try {
    let poll_id = req.params.id;

    if (!(await isValidPollId(poll_id)))
      return res.status(400).send("PollId is not valid");

    next();
  } catch (err) {
    console.log("Loi o middleware: ", err);
    return res.status(400).send("Error in middleware: ", err);
  }
};

module.exports = {
  sendMail,
  validateToken,
  uploadSingleFile,
  uploadMultipleFile,
  createPoll,
  deletePoll,
  createOption,
  vote,
  unVote,
  getVote,
};
