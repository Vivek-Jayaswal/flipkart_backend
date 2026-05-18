const express = require("express");
const { tempAuthMiddleware } = require("../middlewares/tempAuthMiddleware.js");

// file import
const {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
  sellerDetailsRegisterController,
  verifySellerAuthController,
  verifyBuyerAuthController,
  logoutController,
} = require("../controller/authController");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare.js");
const { isSellerMiddleWare } = require("../middlewares/isSellerMiddleWare.js");

const authRouter = express.Router();

authRouter.post("/send-otp", sendOtpController);
authRouter.post("/verify-otp", verifyOtpController);
authRouter.post("/register", tempAuthMiddleware, registerController);
authRouter.post(
  "/update-seller-resiter-details",
  isAuthMiddleWare,
  sellerDetailsRegisterController,
);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh-token", refreshTokenController);

// Verification endpoints - call these on app initialization
authRouter.get("/verify-seller", isAuthMiddleWare, verifySellerAuthController);
authRouter.get("/verify-buyer", isAuthMiddleWare, verifyBuyerAuthController);

module.exports = authRouter;
