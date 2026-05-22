const express = require("express");
const {
  createBrandController,
  deleteBrandController,
  updateBrandController,
  getAllBrandsController,
  getSingleBrandController,
} = require("../controller/brandController");
const { isAuthMiddleWare } = require("../middlewares/authMiddleWare");
const { logoUpload } = require("../middlewares/upload");
const brandRouter = express.Router();

// file import

brandRouter.post(
  "/create-brand",
  isAuthMiddleWare,
  logoUpload.single("logo"),
  createBrandController,
);
brandRouter.post(
  "/update-brand/:id",
  isAuthMiddleWare,
  logoUpload.single("logo"),
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
