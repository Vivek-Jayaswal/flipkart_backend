const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    attributes: {
      color: String,

      size: String,

      storage: String,

      ram: String,
    },

    sku: String,

    price: Number,

    stock: Number,

    images: [
      {
        public_id: String,

        url: String,
      },
    ],
  },

  {
    _id: false,
  },
);

const specificationSchema = new mongoose.Schema(
  {
    key: String,

    value: String,
  },

  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    shortDescription: String,

    description: String,

    brand: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Brand",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Category",

      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",
    },

    sku: {
      type: String,
      unique: true,
    },

    barcode: String,

    price: {
      type: Number,
      required: true,
    },

    salePrice: Number,

    stock: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      public_id: String,

      url: String,
    },

    images: [
      {
        public_id: String,

        url: String,
      },
    ],

    variants: [variantSchema],

    specifications: [specificationSchema],

    tags: [String],

    ratings: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,

      enum: ["draft", "pending", "approved", "rejected"],

      default: "pending",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "user",
    },
  },

  {
    timestamps: true,
    strict: true,
  },
);

productSchema.index({
  category: 1,
});

productSchema.index({
  brand: 1,
});

productSchema.index({
  seller: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model("Product", productSchema);
