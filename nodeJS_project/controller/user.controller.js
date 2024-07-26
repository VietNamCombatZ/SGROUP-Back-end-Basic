const userServices = require("../services/user.services.js");
const utils = require("../utils/utils.js");
const dotenv = require("dotenv");
dotenv.config();

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
    // console.log(passwordResetExpiration);

    // const user = 
    await userServices.insertToken(
      username,
      token,
      passwordResetExpiration
    );

    // if (!user) {
    //   return res.status(404).send("Invalid token or expireTime");
    // }

    return res.status(200).send({ token: token, expiresIn: tokenLifetime });
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const getAllUsers = async(req, res) => {
  
  try {
    // console.log("check");
    const userList = await userServices.getAllUsers();

    if (userList[0] == null) {
      return res.status(404).send("User database empty"); 
    }
    return res.status(200).send(userList);
    
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
}

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

const resetPass = async (req, res) => {
  try {
    const mail = req.body.mail;
    const passwordResetToken = req.body.token;
    const newPass = req.body.newPass;

    const isSuccess = await userServices.resetPass(
      mail,
      passwordResetToken,
      newPass
    );

    if (!isSuccess) {
      return res.status(404).send("Failed to reset password");
    }

    return res.status(200).send("Changed password");
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const uploadSingleFile = (req, res) => {
  return res.send("Single file");
};

const uploadMultipleFile = (req, res) => {
  return res.send("Multiple file");
};

const createPoll = async (req, res) => {
  try {
    console.log(req.user);

    //username = req.user.username;
    const obj = req.body;

    const bool = await userServices.createPoll(obj);  

    if (!bool) {
      return res.status(404).send("Failed to create poll");
    }
    return res.status(200).send("Create poll successfully");
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const deletePoll = async (req, res) => {
  try {
    const id = req.params.id;

    const bool = await userServices.deletePoll(id);

    if (!bool) {
      return res.status(400).send("Cannot delete this poll");
    }
    return res.status(200).send("Poll with ID " + id + " has been deleted!");
  } catch (err) {
    console.error(err); // Logging the error for debugging
    return res.status(500).send("Internal server error");
  }
};

const createOption = async (req, res) => {
  try {
    const obj = req.body;
    const boolean = await userServices.createOption(obj);

    if (!boolean) {

      console.log("Option created");
     return res.status(400).send("Failed to create option");
      
    } 
    console.log("Option fail to create");
    return res.status(200).send("Create option completed!");
   
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

const vote = async (req, res) => {
  try {
    const obj = req.body;
    const boolean = await userServices.vote(obj);

    if (!boolean) {
      console.log("Vote fail");
      return res.status(400).send("Failed to vote");
    }
    console.log("Vote success");
    return res.status(200).send("Vote successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

const unVote = async (req, res) => {
  try {
    const obj = req.body;
    const bool = await userServices.unVote(obj);

    if (!bool) {
      console.log("Unvote failed");
      return res.status(400).send("Error when unvoted");
    } 
    console.log("Unvote success");
    return res.status(200).send("Unvoted Completed!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

const getVote = async (req, res) => {
  try {
    const id = req.params.id;
    const output = await userServices.getVote(id);

    if (!output) {
      res.status(400).send("Cannot get votes");
    }
    res.status(200).send(output);

    return;
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  forgotPass,
  resetPass,
  uploadSingleFile,
  uploadMultipleFile,
  createPoll,
  deletePoll,
  createOption,
  vote,
  unVote,
  getVote
};
