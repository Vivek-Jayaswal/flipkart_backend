const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const isEmailValidate = ({ key }) => {
  const isEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
      key,
    );
  return isEmail;
};

const validateData = async ({ email }) => {
  return new Promise((resolve, reject) => {
    if (!isEmailValidate({ key: email })) reject("Email format is inncorrect");
    resolve();
  });
};

const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const generatTempAccessToken = (email) => {
  const token = jwt.sign(
    { email: email, purpose: "email_verification" },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10m" },
  );

  return token;
};
const generatAccessToken = (email, id) => {
  const token = jwt.sign({ id: id, email: email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });

  return token;
};

const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decode.purpose !== "email_verification") {
      throw new Error("Invalid token purpose");
    }

    return decode.email;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

const genrateRefreshToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = {
  validateData,
  generateOTP,
  generatTempAccessToken,
  generatAccessToken,
  verifyToken,
  genrateRefreshToken,
};
