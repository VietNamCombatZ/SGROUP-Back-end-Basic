const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const middleware = require("../middleware/middleware.js");




router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/getAllUsers", userController.getAllUsers);

router.post("/forgot-pass", userController.forgotPass);
router.post("/reset-pass", userController.resetPass);

router.post("/single", middleware.uploadSingleFile,userController.uploadSingleFile); 
router.post("/multiple",middleware.uploadMultipleFile, userController.uploadMultipleFile);

router.post("/check", middleware.validateToken, async(req,res) => {
    res.status(200).send("check");
})


router.post("/create-poll", middleware.validateToken , middleware.createPoll,userController.createPoll);
router.delete("/delete-poll/:id", middleware.deletePoll,userController.deletePoll);
router.post('/create-option', middleware.createOption, userController.createOption)
router.post("/vote",middleware.vote, userController.vote);
router.delete("/unvote",middleware.unVote, userController.unVote);
router.get("/get-vote/:id",middleware.getVote, userController.getVote);

module.exports = router;
