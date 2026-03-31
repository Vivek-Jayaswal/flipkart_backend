const userSchema = require("../schemas/userSchema");
const otpSchema = require("../schemas/otpSchema");
const bcrypt = require("bcryptjs");
const refreshTokenSchema = require("../schemas/refreshTokenSchema");
const sellerSchema = require("../schemas/sellerSchema");

const findUserByEmail = async (email) => {
  return await userSchema.findOne({ email });
};
const findRefreshTokenByToken = async (token) => {
  return await refreshTokenSchema.findOne({ token: token });
};
const findUserById = async (id) => {
  return await userSchema.findOne({ _id: id });
};
const findSellerById = async (id) => {
  return await sellerSchema.findOne({ _id: id });
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

const createUserCollection = (email, password, name, mobile, address) => {
  return new Promise(async (resolve, reject) => {
    try {
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
        isVerified: true,
      });
      const userCreated = await user.save();
      resolve(userCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const updateRoleInCollection = (role, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedUserRole = await userSchema.findOneAndUpdate(
        { _id: id },
        { $addToSet: { roles: role } },
      );
      resolve(updatedUserRole);
    } catch (error) {
      reject(error);
    }
  });
};

const createSellerCollection = (
  user,
  businessName,
  storeName,
  businessType,
  taxDetails,
  storeAddress,
  bankDetails,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const seller = new sellerSchema({
        userId: user,
        businessName,
        storeName,
        businessType,
        taxDetails,
        storeAddress,
        bankDetails,
      });
      const sellerCreated = await seller.save();
      resolve(sellerCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const createRefeshToken = (token, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refresToken = await refreshTokenSchema.create({
        userId: id,
        token: token,
      });
      resolve(refresToken);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUserByEmail,
  findUserByEmailAndOtp,
  createUserTempararyCollection,
  createUserCollection,
  createRefeshToken,
  findRefreshTokenByToken,
  findUserById,
  createSellerCollection,
  updateRoleInCollection,
  findSellerById,
};
