const express = require("express");
const {
  createProductController,
  getAllProductController,
  updateProductController,
  deleteProductController,
  getSingleProductController,
  searchProductController,
} = require("../controller/productController");

const productRouter = express.Router();
const { upload } = require("../middlewares/upload");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare");
const { isSellerMiddleWare } = require("../middlewares/isSellerMiddleWare");

productRouter.post(
  "/create-product",
  isAuthMiddleWare,
  isSellerMiddleWare,
  // upload.single("image"),
  createProductController,
);
productRouter.get("/get-all-product", getAllProductController);
productRouter.post("/update-product", updateProductController);
productRouter.delete("/delete-product", deleteProductController);
productRouter.get("/get-single-product", getSingleProductController);
productRouter.get("/search-product", searchProductController);

module.exports = productRouter;
