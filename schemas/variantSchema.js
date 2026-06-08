const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      // unique: true,
    },

    attributes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    weight: {
      type: Number,
      default: 0,
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = productVariantSchema;
