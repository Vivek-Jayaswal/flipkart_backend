const express = require("express");
const { tempAuthMiddleware } = require("../middlewares/tempAuthMiddleware.js");

// file import
const {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
} = require("../controller/authController");

const authRouter = express.Router();

authRouter.post("/send-otp", sendOtpController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.post("/register", tempAuthMiddleware, registerController);
authRouter.post("/login", loginController);
authRouter.post("/refresh-token", refreshTokenController);

module.exports = authRouter;
