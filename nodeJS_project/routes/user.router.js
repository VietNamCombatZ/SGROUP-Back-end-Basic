const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller.js");
const middleware = require("../middleware/middleware.js");




router.post("/register", userController.register);
router.post("/login", userController.login);

// router.get("/getAllInfo", userController.getAllUsers);

router.post("/forgot-pass", userController.forgotPass);
router.post("/reset-pass", userController.resetPass);

// router.post("/single", userController.uploadSingleFile);
// router.post("/multiple", userController.uploadMultipleFile);

// router.post("/poll", userController.poll);

module.exports = router;
