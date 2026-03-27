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
} = require("../model/authModel");
const { sendOTP } = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller
const registerController = async (req, res) => {
  const { gmail, password, name, mobile, address } = req.body;
  // console.log(req.tempUser);

  try {
    if (!gmail || !password || !name || !mobile || !address) {
      return res.send({
        status: 400,
        message: "All fields are required",
      });
    }
  } catch (error) {
    return res.send({
      status: 400,
      message: "All fields are required",
      error: error,
    });
  }

  try {
    const isUserExist = await findUserByEmail(gmail);

    if (isUserExist) {
      return res.status(400).json({
        message: "User Allready Exist",
        status: 400,
      });
    }

    const isUserCreated = await createUserCollection(
      gmail,
      password,
      name,
      mobile,
      address,
    );

    if (!isUserCreated) {
      return res.send({
        status: 400,
        message: "User registration failed",
      });
    }

    return res.send({
      status: 200,
      message: "User registered successfully",
      data: isUserCreated,
    });
  } catch (err) {
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

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login Successfull",
      status: 200,
      data: empDetails,
      token: accessToken,
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
  const { gmail } = req.body;

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
    if (isUserExist) {
      return res.send({
        message: "User already exist",
        status: 400,
      });
    }

    const otp = generateOTP();
    await createUserTempararyCollection(gmail, otp);
    await sendOTP(gmail, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      status: 200,
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
  const { gmail, otp } = req.body;

  try {
    const userExist = await findUserByEmailAndOtp(gmail, otp);
    if (!userExist) {
      return res.status(400).json({
        status: 400,
        message: "Invalid OTP",
      });
    }

    if (userExist.expiresAt < new Date()) {
      return res.status(400).json({
        status: 400,
        message: "OTP has expired",
      });
    }

    if (userExist.email === gmail && userExist.otp === otp) {
      const token = generatTempAccessToken(userExist.email);
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
  const token = req?.cookies?.refreshToken;
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

module.exports = {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
  refreshTokenController,
};
