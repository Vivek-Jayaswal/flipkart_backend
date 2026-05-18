const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    level: {
      type: Number,
      default: 1,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // WHO CREATED
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // LAST UPDATED BY
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // UPDATE HISTORY
    updateHistory: [
      {
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "User",
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
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
