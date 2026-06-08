const express = require("express");
const {
  createBrandController,
  deleteBrandController,
  updateBrandController,
  getAllBrandsController,
  getSingleBrandController,
} = require("../controller/brandController");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare");
const { upload } = require("../middlewares/upload");
const brandRouter = express.Router();

// file import

brandRouter.post(
  "/create-brand",
  isAuthMiddleWare,
  upload.single("logo"),
  createBrandController,
);
brandRouter.post(
  "/update-brand/:id",
  isAuthMiddleWare,
  upload.single("logo"),
  updateBrandController,
);
brandRouter.delete(
  "/delete-brand/:id",
  isAuthMiddleWare,
  deleteBrandController,
);
brandRouter.get("/get-all-brands", isAuthMiddleWare, getAllBrandsController);
brandRouter.get(
  "/get-single-brand/:id",
  isAuthMiddleWare,
  getSingleBrandController,
);

module.exports = brandRouter;
