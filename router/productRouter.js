const express = require("express");
const { createProductController } = require("../controller/productController");

const productRouter = express.Router();

productRouter.post("/create-product", createProductController);

module.exports = productRouter;
