const {
  validateData,
  generateOTP,
  generatTempAccessToken,
  generatAccessToken,
  genrateRefreshToken,
} = require("../utils/authUtils");
const {
  findUserByEmail,
  createUserTempararyCollection,
  findUserByEmailAndOtp,
  createUserCollection,
  createRefeshToken,
  findRefreshTokenByToken,
  findUserById,
  createSellerCollection,
  findSellerById,
  updateRoleInCollection,
  updateSellerCollection,
} = require("../model/authModel");

const getRefreshTokenCookieName = (role) => {
  return role === "seller" ? "sellerRefreshToken" : "buyerRefreshToken";
};

const setRefreshTokenCookie = (res, refreshToken, role) => {
  res.cookie(getRefreshTokenCookieName(role), refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "strict",
  });
};

const { sendOTP } = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller
const registerController = async (req, res) => {
  const { gmail, password, name, mobile, address, role } = req.body;

  if (
    role === "buyer" &&
    (!gmail || !password || !name || !mobile || !address || !role)
  ) {
    return res.status(400).json({
      status: 400,
      message: "All fields are required",
    });
  }

  if (role === "seller" && (!gmail || !mobile || !password)) {
    return res.status(400).json({
      status: 400,
      message: "All fields are required",
    });
  }

  if (!["buyer", "seller"].includes(role)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid role",
    });
  }

  if (req.tempUser.role !== role) {
    return res.status(400).json({
      status: 400,
      message: "Invalid user. user role mismatch",
    });
  }

  try {
    const isUserExist = await findUserByEmail(gmail);

    if (isUserExist && !isUserExist.isVerified) {
      return res.status(400).json({
        status: 400,
        message: "Please verify your account first",
      });
    }

    if (isUserExist && isUserExist.isVerified) {
      if (isUserExist.roles.includes(role)) {
        return res.status(400).json({
          message: "User Allready Exist",
          status: 400,
        });
      }

      await updateRoleInCollection(role, isUserExist._id);

      if (role === "seller") {
        const isSellerExist = await findSellerById(isUserExist._id);

        if (!isSellerExist) {
          await createSellerCollection(isUserExist._id);

          const accessToken = generatAccessToken(gmail, isUserExist._id);
          const refreshToken = genrateRefreshToken(isUserExist._id);

          await createRefeshToken(refreshToken, isUserExist._id);

          setRefreshTokenCookie(res, refreshToken, "seller");

          return res.status(200).json({
            message: "User role updated successfully",
            status: 200,
            data: isUserExist,
          });
        }
      }
    }

    if (role === "buyer") {
      const isUserCreated = await createUserCollection(
        gmail,
        password,
        mobile,
        role,
        name,
        address,
      );
      return res.send({
        status: 200,
        message: "User registered successfully",
        data: isUserCreated,
      });
    }

    if (role === "seller") {
      const isUserCreated = await createUserCollection(
        gmail,
        password,
        mobile,
        role,
      );

      console.log(isUserCreated);

      await createSellerCollection(isUserCreated._id);
      const accessToken = generatAccessToken(gmail, isUserCreated._id);
      const refreshToken = genrateRefreshToken(isUserCreated._id);

      await createRefeshToken(refreshToken, isUserCreated._id);

      setRefreshTokenCookie(res, refreshToken, "seller");

      return res.send({
        status: 200,
        message: "Seller registered successfully",
        data: isUserCreated,
        token: accessToken,
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err,
    });
  }
};

const sellerDetailsRegisterController = async (req, res) => {
  const {
    name,
    address,
    role,
    businessType,
    taxDetails,
    storeAddress,
    bankDetails,
  } = req.body;

  const userInfo = req.user;

  console.log("info", userInfo._id);

  if (!userInfo.roles.includes("seller")) {
    return res.status(400).json({
      status: 400,
      message: "This details only seller can fill",
    });
  }

  try {
    const isUserExist = await findUserById(userInfo._id);

    if (isUserExist && isUserExist.isVerified) {
      const data = await updateSellerCollection({
        userId: isUserExist._id,
        businessType: businessType,
        taxDetails: taxDetails,
        storeAddress: storeAddress,
        bankDetails: bankDetails,
      });

      return res.status(200).json({
        status: 200,
        message: "Details updated successfull",
        data: data,
      });
    }

    return res.status(400).json({
      status: 400,
      message: "User not found for given mail id",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: err,
    });
  }
};

// login controller
const loginController = async (req, res) => {
  const { gmail, passward } = req.body;

  if (!gmail || !passward) {
    return res.status(400).json({
      message: "Missing Details",
      status: 400,
    });
  }

  try {
    const empDetails = await findUserByEmail(gmail);

    if (!empDetails) {
      return res.status(400).json({
        message: "User not found please register first",
        status: 400,
      });
    }

    const isMatched = await bcrypt.compare(passward, empDetails?.password);

    if (!isMatched) {
      return res.status(400).json({
        message: "Wrong Password",
        status: 400,
      });
    }

    const accessToken = generatAccessToken(gmail, empDetails._id);
    const refreshToken = genrateRefreshToken(empDetails._id);

    await createRefeshToken(refreshToken, empDetails._id);

    const loginRole = req.body.role
      ? req.body.role
      : empDetails.roles?.includes("seller")
        ? "seller"
        : "buyer";

    setRefreshTokenCookie(res, refreshToken, loginRole);

    return res.status(200).json({
      message: "Login Successfull",
      status: 200,
      data: empDetails,
      token: accessToken,
      role: loginRole,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

// send otp controllerJ
const sendOtpController = async (req, res) => {
  const { gmail, role } = req.body;

  if (!gmail || !role) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Fields are missing",
    });
  }

  try {
    await validateData({ email: gmail });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Email format is incorrect",
      error: error,
    });
  }
  try {
    const isUserExist = await findUserByEmail(gmail);
    console.log(isUserExist);

    if (isUserExist && isUserExist.roles.includes(role)) {
      return res.status(400).json({
        message: "User already exist",
        status: 400,
      });
    }

    const otp = generateOTP();
    await createUserTempararyCollection(gmail, otp, role);
    await sendOTP(gmail, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      status: 200,
      data: otp,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: error,
    });
  }
};

// verify otp controller
const verifyOtpController = async (req, res) => {
  const { gmail, otp, role } = req.body;
  console.log("calling");

  if (!gmail || !otp || !role) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Fields are missing",
    });
  }

  try {
    const userExist = await findUserByEmailAndOtp(gmail, otp);
    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "Invalid OTP",
      });
    }

    if (userExist && userExist.role !== role) {
      return res.status(400).json({
        status: 400,
        message: "Invalid user role",
      });
    }

    if (userExist.role === role && userExist.expiresAt < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "OTP has expired",
      });
    }

    if (
      userExist.email === gmail &&
      userExist.otp === otp &&
      userExist.role === role
    ) {
      const token = generatTempAccessToken(userExist.email, role);
      return res.status(200).json({
        status: 200,
        message: "OTP verified successfully",
        token: token,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      // message: "Email format is incorrect",
      error: error,
    });
  }
};

//  refresh token
const refreshTokenController = async (req, res) => {
  const role = req.body?.role || req.query?.role;
  const refreshTokenCookieName = getRefreshTokenCookieName(role);
  const token = req?.cookies?.[refreshTokenCookieName];

  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  try {
    const stored = await findRefreshTokenByToken(token);

    if (!stored) {
      return res.status(404).json({
        message: "Invalid token",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = stored.userId;
    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generatAccessToken(user?.email, id);

    return res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Expired token" });
  }
};

// Verify seller auth - called on app initialization to validate token with backend
const verifySellerAuthController = async (req, res) => {
  try {
    const user = req.user; // From authMiddleware

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "User not authenticated",
      });
    }

    // Check if user is a seller
    if (!user.roles?.includes("seller")) {
      return res.status(403).json({
        status: 403,
        message: "User is not a seller",
      });
    }

    // Get seller details
    const seller = await findSellerById(user._id);

    return res.status(200).json({
      status: 200,
      message: "Seller verified successfully",
      data: {
        isSellerProfileCompleted: seller?.isSellerProfileCompleted ?? false,
        role: "seller",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Verify buyer auth - similar for buyers
const verifyBuyerAuthController = async (req, res) => {
  try {
    const user = req.user; // From authMiddleware

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "User not authenticated",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Buyer verified successfully",
      data: {
        role: "buyer",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
  sellerDetailsRegisterController,
  verifySellerAuthController,
  verifyBuyerAuthController,
};
