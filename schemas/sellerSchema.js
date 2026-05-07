const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    businessName: { type: String, default: "" },
    storeName: { type: String, default: "", unique: true },
    businessType: {
      enum: ["Individual", "Partnership", "Company"],
      type: String,
      default: "Individual",
    },

    taxDetails: {
      pan: { type: String, default: "" },
      gstin: { type: String, default: "" },
    },

    storeAddress: {
      registered: { type: String, default: "" },
      pickup: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: Number, default: "" },
    },

    bankDetails: {
      accountNumber: {
        type: String,
        default: "",
      },

      ifsc: {
        type: String,
        default: "",
      },
      bankName: { type: String, default: "" },
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
