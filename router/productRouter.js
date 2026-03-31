const express = require("express");
const {
  createProductController,
  getAllProductController,
} = require("../controller/productController");

const productRouter = express.Router();
const { upload } = require("../middlewares/upload");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare");
const { isSellerMiddleWare } = require("../middlewares/isSellerMiddleWare");

productRouter.post(
  "/create-product",
  isAuthMiddleWare,
  isSellerMiddleWare,
  upload.single("image"),
  createProductController,
);
productRouter.get("/get-all-product", getAllProductController);

module.exports = productRouter;
