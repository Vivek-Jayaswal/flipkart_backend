const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: { type: String, required: true },
    storeName: { type: String, required: true, unique: true },
    businessType: {
      type: String,
      enum: ["Individual", "Partnership", "Company"],
      required: true,
    },

    taxDetails: {
      pan: { type: String, required: true },
      gstin: { type: String },
    },

    storeAddress: {
      registered: { type: String, required: true },
      pickup: { type: String, required: true },
      city: String,
      state: String,
      pincode: Number,
    },

    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: String,
    },

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Seller", sellerSchema);
