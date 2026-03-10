const userSchema = require("../schemas/userSchema");
const otpSchema = require("../schemas/otpSchema");
const bcrypt = require("bcryptjs");

const findUserByEmail = async (email) => {
  return await userSchema.findOne({ email });
};

const findUserByEmailAndOtp = async (email, otp) => {
  return await otpSchema.findOne({ email, otp }, {});
};

const createUserTempararyCollection = async (email, otp) => {
  const tempUser = await otpSchema.findOneAndUpdate(
    { email },
    { email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true, new: true },
  );
  return tempUser;
};

const createUserCollection = async (email, password, name, mobile, address) => {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS),
  );

  const user = new userSchema({
    email,
    password: hashedPassword,
    name,
    mobile,
    address,
  });

  console.log("user:", user);
  return await user.save();
};

module.exports = {
  findUserByEmail,
  findUserByEmailAndOtp,
  createUserTempararyCollection,
  createUserCollection,
};
