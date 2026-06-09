const mongoose = require("mongoose");
const productVariantSchema = require("./variantSchema.js");
const specificationSchema = require("./specificationSchema.js");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },

    // categories: {
    //   type: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Category",
    //     },
    //   ],
    //   validate: [(arr) => arr.length > 0, "At least one category is required"],
    // },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    thumbnail: {
      url: String,
      public_id: String,
    },

    gallery: [
      {
        url: String,
        public_id: String,
      },
    ],

    // videoUrl: String,

    tags: [String],

    variants: [productVariantSchema],

    specifications: [specificationSchema],

    warranty: {
      type: String,
      default: "No Warranty",
    },

    returnPolicy: {
      type: String,
      default: "7 Days Return",
    },

    currentStep: {
      type: Number,
      default: 1,
    },

    shippingInfo: {
      dispatchTime: {
        type: String,
        default: "2 Days",
      },

      freeShipping: {
        type: Boolean,
        default: false,
      },
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
      },

      count: {
        type: Number,
        default: 0,
      },
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,

    rejectionReason: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isFlashSale: {
      type: Boolean,
      default: false,
    },

    flashSalePrice: {
      type: Number,
      default: 0,
    },

    flashSaleStart: Date,

    flashSaleEnd: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// productSchema.index({
//   title: "text",
//   shortDescription: "text",
//   description: "text",
//   tags: "text",
// });

// productSchema.index({
//   seller: 1,
// });

// productSchema.index({
//   brand: 1,
// });

// productSchema.index({
//   categories: 1,
// });

// productSchema.index({
//   status: 1,
// });

module.exports = mongoose.model("Product", productSchema);
