const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },

  value: {
    type: String,
    required: true,
  },
});

module.exports = specificationSchema;
