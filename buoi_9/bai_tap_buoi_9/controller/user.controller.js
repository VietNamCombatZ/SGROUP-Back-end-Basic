const userServices = require("../services/user.services.js");
const utils = require("../utils/utils.js");

const register = async (req, res) => {
  try {
    // const { username, pass, mail } = req.body;
    const username = req.body.username;
    const pass = req.body.pass;
    const mail = req.body.mail;

    const isExistence = await utils.isExistence(username);

    //If user exist return status + message

    if (isExistence) {
      return res.status(404).send("User already exists");
    }

    const hashedPass = await userServices.hashPassword(pass);
    const users = await userServices.insertInfo(username, hashedPass, mail);

    if (users instanceof Error) {
      // Corrected error instance check
      throw users;
    }

    return res.status(200).send({ username, pass, mail });
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const login = async (req, res) => {
  try {
    const { username, pass } = req.body;
    const secret = process.env.MY_SECRET;

    const hashedPass = await userServices.hashPassword(pass);
    // console.log("check1");
    const { token, tokenLifetime } = await userServices.validateUser(
      username,
      pass
    );
    // console.log("check2");

    if (!token) {
      return res.status(404).send("Invalid username or password");
    }
    const passwordResetExpiration = new Date(Date.now() + 1000 * 60 * 30);
    console.log(passwordResetExpiration);

    const user = await userServices.insertToken(
      username,
      token,
      passwordResetExpiration
    );
    if (!user) {
      return res.status(404).send("Invalid token or expireTime");
    }

    return res.status(200).send({ token: token, expiresIn: tokenLifetime });
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const forgotPass = async (req, res) => {
  try {
    const userEmail = req.body.mail;
    // console.log(userEmail);

    const resetMailIsSent = await userServices.forgotPass(userEmail);

    if (!resetMailIsSent) {
      return res.status(404).send("Failed to send reset email");
    }

    return res.status(200).send("Reset pass email sent, pls check your mail");
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const resetPass = async(req,res) => {
  try {
    const mail = req.body.mail;
    const passwordResetToken = req.body.token;
    const newPass = req.body.newPass;

    const isSuccess = await userServices.resetPass(mail, passwordResetToken, newPass);

    if(!isSuccess){
      return res.status(404).send("Failed to reset password");v
    }

    return res.status(200).send("Changed password");

  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
}
module.exports = {
  register,
  login,
  forgotPass,
  resetPass
};
