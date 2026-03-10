const { validateData, generateOTP } = require("../utils/authUtils");
const {
  findUserByEmail,
  createUserTempararyCollection,
  findUserByEmailAndOtp,
  createUserCollection,
} = require("../model/authModel");
const { sendOTP } = require("../utils/sendMail");

// register controller
const registerController = async (req, res) => {
  const { gmail, password, name, mobile, address } = req.body;
  console.log("YES");

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
    const isUserCreated = await createUserCollection(
      gmail,
      password,
      name,
      mobile,
      address,
    );

    console.log("is", isUserCreated);

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
    console.log("error", err);

    return res.send({
      status: 500,
      message: "Internal server error",
      error: err,
    });
  }
};

// login controller
const loginController = (req, res) => {
  console.log("from login controller");
  return res.send("all ok");
};

// send otp controller
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
    console.log("error:", error);

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
      console.log("yes");
    }

    return res.status(200).json({
      status: 200,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      // message: "Email format is incorrect",
      error: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  sendOtpController,
  verifyOtpController,
};
