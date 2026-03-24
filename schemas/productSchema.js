const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  brand: {
    type: String
  },

  category: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  discountPrice: {
    type: Number
  },

  stock: {
    type: Number,
    required: true
  },

  imagePath : {
    type : String
  },

  imageURL : {
    type : String
  },

  seller: {
    type : String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    required: true
  },

  ratings: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("product", productSchema);