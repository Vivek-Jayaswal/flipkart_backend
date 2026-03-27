const fs = require("fs");
const { createProduct, getAllProduct } = require("../model/productModel");

// create product api
const createProductController = async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    price,
    discountPrice,
    stock,
    seller,
    ratings,
    numReviews,
  } = req?.body;
  // const file = req?.file;

  try {
    if (!req?.file) {
      return res.status(400).json({
        status: 400,
        message: "Image file is missing",
      });
    } else {
      const imagePath = req?.file?.path;
      const imageURL = `${req.protocol}://${req.get("host")}/${req.file.path}`;
      const created = await createProduct({
        name,
        description,
        brand,
        category,
        price,
        discountPrice,
        stock,
        imagePath,
        imageURL,
        seller,
        ratings,
        numReviews,
        // isActive,
      });

      return res.status(201).json({
        status: 201,
        message: "Product Created Successfully",
        data: created,
      });
    }
  } catch (error) {
    if (req?.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      status: 500,
      message: "error",
      error: error.message,
    });
  }
};

// update product api
const updateProductController = async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    price,
    discountPrice,
    stock,
    seller,
    ratings,
    numReviews,
    productId,
  } = req?.body;
  // const file = req?.file;

  try {
    if (!req?.file) {
      return res.status(400).json({
        status: 400,
        message: "Image file is missing",
      });
    } else {
      const imagePath = req?.file?.path;
      const imageURL = `${req.protocol}://${req.get("host")}/${req.file.path}`;

      const created = await createProduct({
        name,
        description,
        brand,
        category,
        price,
        discountPrice,
        stock,
        imagePath,
        imageURL,
        seller,
        ratings,
        numReviews,
        // isActive,
      });

      return res.status(201).json({
        status: 201,
        message: "Product Created Successfully",
        data: created,
      });
    }
  } catch (error) {
    if (req?.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      status: 500,
      message: "error",
      error: error.message,
    });
  }
};

// get all product api
const getAllProductController = async (req, res) => {
  try {
    const allProduct = await getAllProduct();

    return res.status(201).json({
      status: 201,
      message: "Product get Successfully",
      data: allProduct,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "error",
      error: error.message,
    });
  }
};

module.exports = {
  createProductController,
  getAllProductController,
  updateProductController,
};
