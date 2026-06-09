const productRouter = require("express").Router();
const { isAuthMiddleWare } = require("../../middlewares/authMiddleWare");
const { createUploadMiddleware, upload } = require("../../middlewares/upload");
const { default: asyncHandler } = require("../../utils/asyncHandler");
const {
  createDraftProduct,
  getAllProductController,
  saveVariants,
  saveSpecifications,
  saveInventory,
  submitProductForApproval,
  saveVariantImages,
} = require("./product.controller");

productRouter.post(
  "/create-draft-product",
  isAuthMiddleWare,
  createUploadMiddleware(["thumbnail", "gallery"]),
  asyncHandler(createDraftProduct),
);

productRouter.get("/get-all-product", asyncHandler(getAllProductController));

productRouter.patch(
  "/:id/save-variants",
  isAuthMiddleWare,
  asyncHandler(saveVariants),
);

productRouter.patch(
  "/:id/save-variants-images",
  isAuthMiddleWare,
  createUploadMiddleware(["variantImages"]),
  asyncHandler(saveVariantImages),
);

// productRouter.patch(
//   "/:id/save-variants-with-images",
//   isAuthMiddleWare,
//   upload.any(),
//   asyncHandler(saveVariants),
// );

// productRouter.patch(
//   "/:id/save-variants-with-images",
//   isAuthMiddleWare,
//   upload.any(),
//   asyncHandler(saveVariantsWithImages),
// );

productRouter.patch(
  "/:id/save-specifications",
  isAuthMiddleWare,
  asyncHandler(saveSpecifications),
);

productRouter.post(
  "/:id/save-inventory",
  isAuthMiddleWare,
  asyncHandler(saveInventory),
);

productRouter.post(
  "/:id/submit-product",
  isAuthMiddleWare,
  asyncHandler(submitProductForApproval),
);
// productRouter.delete("/delete-product", asyncHandler(deleteProductController));
// productRouter.get("/get-single-product", asyncHandler(getSingleProductController));
// productRouter.get("/search-product", asyncHandler(searchProductController));

module.exports = productRouter;
