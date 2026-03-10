const otpGenerator = require("otp-generator");

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

module.exports = { validateData, generateOTP };
