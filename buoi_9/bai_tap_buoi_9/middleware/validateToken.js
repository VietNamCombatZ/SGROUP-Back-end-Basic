const jwt = require("jsonwebtoken");
const conn = require("../database/connection.js");
var MY_SECRET = process.env.MY_SECRET;


const getUser = async (username) =>{
    var [result] = await conn.query("select * from user_db where username = ?", [username]);
    return [result]
}

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

async function validateToken(req, res) {
  try {
    var { loginUsername, loginPass } = req.body;

    //Login username & pass missing
    if (!loginUsername || !loginPass) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    
    var userInfo = await getUser(loginUsername);
    if (!userInfo) {
      return res.status(403).json({ error: "Invalid login" });
    }

    if (userInfo.pass !== loginPass) {
      // You should hash passwords and compare hashes instead
      return res.status(403).json({ error: "Invalid login" });
    }

    delete userInfo.pass;

    const token = jwt.sign(
      { id: userInfo.id, username: userInfo.username },
      MY_SECRET,
      { expiresIn: "5m" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// module.exports = {validateToken};



