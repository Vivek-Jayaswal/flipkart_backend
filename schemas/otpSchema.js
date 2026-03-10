const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("otp", otpSchema);
