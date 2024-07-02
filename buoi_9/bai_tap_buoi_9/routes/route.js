const conn = require("../database/connection.js");
const validateToken = require ("../middleware/validateToken.js")

const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
const bodyParser = require("body-parser");

const port = 3000;

app.use(bodyParser.json());

// app.post("/page/register", async (req, res) => {
//   const { username, pass } = req.body;

//   if (!username || !pass) {
//     return res
//       .status(400)
//       .json({ error: "Username and password are required" });
//   }

//   try {
//     // Check if username already exists
//     const checkUserQuery = "SELECT * FROM user_db WHERE username = ?";
//     conn.query(checkUserQuery, [username], async (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: "Database error", details: err });
//       }

//       if (results.length > 0) {
//         return res.status(409).json({ error: "Username already exists" });
//       }

//       // Hash the password
//       const hashedPassword = await bcrypt.hash(pass, 10);

//       // Insert user into the database
//       const insertUserQuery =
//         "INSERT INTO user_db (username, pass) VALUES (?, ?)";
//       conn.query(
//         insertUserQuery,
//         [username, hashedPassword],
//         (err, results) => {
//           if (err) {
//             return res
//               .status(500)
//               .json({ error: "Database error", details: err });
//           }

//           res.status(201).json({ message: "User registered successfully" });
//         }
//       );
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Server error", details: error });
//   }
// });

app.post("/page/register", async (req, res) => {
  try {
    var username = req.body.username;
    var pass = req.body.pass; 
    var hashedPass = await hashPassword(pass);

    await insertInfo(username, hashedPass);
    res.status(201).send({ username, pass });
    // res.redirect("/page/getAllInfo");
  } catch (err) {
    res.status(500).send("Internal server error");
    console.log("Failed to execute", err);
  }
});

app.post("/page/login", async (req, res) => {
  try {
    var username = req.body.username;
    var pass = req.body.pass;
    // var hashedPass = hashPassword(pass);

    var result = await getUserInfo(username)
    // console.log(result);
    res.status(201).send({username, pass});
  } catch (err) {
    console.log("Failed to post");
  }
});

app.post("/page/login", async (req, res) =>{
  
  //Get username, pass from request
  const { username, pass } = req.body;
  // console.log(req.body);
  try {
     
    //Get login username, pass from database
    const results = await db.query(
      "SELECT id, username, pass FROM user_db WHERE username = ?",
      [username]
    );
    // console.log(results);

    //If no matches info, retrun 400 (missing info)
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(pass, user[0].pass);

    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.MY_SECRET, {
      expiresIn: "30m",
    });
    res.send(token);
    res.redirect("/page/getAllInfo");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error from server" });
  }
})

app.get("/page/getAllInfo", validateToken, async(req, res) => {
  const allUsers = conn.query("select * from user_db");
  res.status(200).json(allUsers);

})

async function hashPassword(pass) {
  var hashPass = await bcrypt.hash(pass, 13);
  // console.log(hashPass);
  return hashPass;
}

async function insertInfo(username, pass) {
  try {
    conn.query(
      "INSERT INTO user_db (username, pass) VALUES (?, ?)",
      [username, pass],
      (err) => {
        console.log("Error while insert");
      }
    );
  } catch (err) {
    console.log("Error with server while insert", err);
  }
}

// const isUserExist = async (username) => {
//   try {
//     const query = "SELECT * FROM user_db WHERE username = ?";
//     const results = await new Promise((resolve, reject) => {
//       conn.query(query, [username], (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     return results.length > 0;
//   } catch (err) {
//     console.error("Failed to check user availability:", err);
//     return false;
//   }
// };

// const insertInfo = async (username, pass, res) => {
//   try {
//     const userExists = await isUserExist(username);
//     if (!userExists) {
//       const hashedPassword = await bcrypt.hash(pass, 10);
//       await new Promise((resolve, reject) => {
//         conn.query(
//           "INSERT INTO user_db (username, pass) VALUES (?, ?)",
//           [username, hashedPassword],
//           (err, results) => {
//             if (err) {
//               reject(err);
//             } else {
//               resolve(results);
//             }
//           }
//         );
//       });
//       res.status(201).send({ username, pass: hashedPassword });
//     } else {
//       res.status(409).send("Username already exists");
//     }
//   } catch (err) {
//     console.log("Error while inserting info", err);
//     res.status(500).send("Internal server error");
//   }
// };

// async function insertInfo(username, pass, res) {
//   try {
//     // const userExists = await isUserExist(username);
//     // if (!userExists) {
//       conn.query(
//         "INSERT INTO user_db (username, pass) VALUES (?, ?)",
//         [username, pass],
//         (err) => {
//           if (err) {
//             console.log("Failed to insert new user info", err);
//             res.send(500, "Failed to insert user info");
//           } else {
//             // res.status(201).send({ username, pass});
//             res.send(201, {username,pass});
//           }
//         }
//       );
//     // } else {
//     //   res.status(409).send("Username is already existed");
//     //   return;
//     // }
//   } catch (err) {
//     console.log("Error while inserting info", err);
//     res.status(500).send("Internal server error");
//   }
// }

// function isUserExist(username) {
//   return new Promise((resolve, reject) => {
//     conn.query(
//       "SELECT * FROM user_db WHERE username = ?",
//       [username],
//       (err, results) => {
//         if (err) {
//           console.error("Failed to check user availability", err);
//           reject(err);
//         } else {
//           resolve(results.length > 0);
//         }
//       }
//     );
//   });
// }

// async function insertInfo(username, pass,res) {
//   try {
//     var check = await isUserExist(username);
//     console.log(check);
//     if (!check) {
//       // conn.query(
//       //   "insert into user_db(username, pass) value (?,?)",
//       //   [username, pass],
//       //   (err) => {
//       //     if (err) {
//       //       console.error("Failed to insert new user info");
//       //       res.status(404).send("Failed to check user available");
//       //     }
//       //   }
//       // );
//       console.log("check");
//       res.status(200).send({ username, pass });
//     } else {
//       res.status(404).send("Username is already existed");
//     }
//   } catch (err) {
//     console.error("Error while insert info");
//   }
// }

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
};

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

// //check if login username and pass match with one in database

// async function isMatchInfo(username, pass) {
//   try {
//     var userInfoDB = getUserInfo(username, pass);
//     if (userInfoDB.username == username && userInfoDB.pass == pass) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.error("Error while executing");
//   }
// }

// async function redirectPage() {
//   try {
//     var loginUsername = document.getElementById("login_user").value;
//     var loginPass = document.getElementById("login_pass").value;

//     if (isMatchInfo(loginUsername, loginPass)) {
//       console.log("Login successfully");
//     }
//   } catch (error) {
//     console.error("Error while executing");
//   }
// }

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
