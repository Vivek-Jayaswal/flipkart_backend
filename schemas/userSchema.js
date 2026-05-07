const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { unique: true, type: String, required: true },
    mobile: { type: Number, required: true },
    name: { type: String, default: "" },
    password: { type: String, required: true },
    roles: {
      type: [String],
      enum: ["buyer", "seller", "admin"],
      default: ["buyer"],
    },
    address: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: true,
  },
);

module.exports = mongoose.model("user", userSchema);
