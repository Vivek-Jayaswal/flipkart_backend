const express = require("express");

// file import
const {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
} = require("../controller/authController");

const authRouter = express.Router();

authRouter.post("/send-otp", sendOtpController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

module.exports = authRouter;
