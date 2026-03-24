const express = require("express");
const { createProductController, getAllProductController } = require("../controller/productController");

const productRouter = express.Router();
const { upload } = require("../middlewares/upload");

productRouter.post(
  "/create-product",
  upload.single("image"),
  createProductController,
);
productRouter.get("/get-all-product", getAllProductController);

module.exports = productRouter;
