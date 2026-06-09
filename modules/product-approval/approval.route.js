const { default: asyncHandler } = require("../../utils/asyncHandler");
const { isAuthMiddleWare } = require("../../middlewares/authMiddleWare");

const {
  getPendingProductsController,
  approveProductController,
  rejectProductController,
} = require("./approvalController");

const approvalRouter = require("express").Router();

approvalRouter.get(
  "/get-pending-products",
  isAuthMiddleWare,
  asyncHandler(getPendingProductsController),
);
approvalRouter.post(
  "/:id/approve-product",
  isAuthMiddleWare,
  asyncHandler(approveProductController),
);
approvalRouter.post(
  "/:id/reject-product",
  isAuthMiddleWare,
  asyncHandler(rejectProductController),
);

module.exports = approvalRouter;
