const express = require("express");
const {
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
  getFormattedCategoriesController,
} = require("../controller/categoryController");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare");
const categoryRouter = express.Router();

// file import

categoryRouter.post(
  "/create-category",
  isAuthMiddleWare,
  createCategoryController,
);
categoryRouter.post(
  "/update-category",
  isAuthMiddleWare,
  updateCategoryController,
);
categoryRouter.delete(
  "/delete-category/:id",
  isAuthMiddleWare,
  deleteCategoryController,
);
categoryRouter.get(
  "/get-all-category",
  isAuthMiddleWare,
  getAllCategoriesController,
);
categoryRouter.get(
  "/get-formatted-categories",
  isAuthMiddleWare,
  getFormattedCategoriesController,
);
categoryRouter.get(
  "/get-single-category/:id",
  isAuthMiddleWare,
  getSingleCategoryController,
);

module.exports = categoryRouter;
