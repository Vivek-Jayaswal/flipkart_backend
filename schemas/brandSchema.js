const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    logo: {
      type: String,
    },
    logoPath: {
      type: String,
    },

    description: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,

      enum: ["active", "inactive"],

      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",

      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",

      default: null,
    },

    updateHistory: [
      {
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "user",
        },

        updatedAt: {
          type: Date,
          default: Date.now,
        },

        changes: {
          type: String,
        },
      },
    ],
  },

  {
    timestamps: true,
    strict: true,
  },
);

brandSchema.index({
  name: "text",
});

module.exports = mongoose.model("Brand", brandSchema);
