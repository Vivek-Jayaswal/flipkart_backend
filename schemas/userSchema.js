const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { unique: true, type: String },
  mobile: { type: Number },
  name: String,
  password: { type: String, required: true },
  roles: {
    type: [String],
    enum: ["buyer", "seller", "admin"],
    default: ["buyer"],
  },
  address: String,
  isVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
