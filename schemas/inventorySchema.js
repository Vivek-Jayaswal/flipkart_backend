const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantSku: {
      type: String,
      required: true,
    },

    warehouse: {
      type: String,
      required: true,
      default: "MAIN",
    },

    quantity: {
      type: Number,
      default: 0,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Inventory", inventorySchema);
