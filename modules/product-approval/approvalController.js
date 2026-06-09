const { apiResponse } = require("../../utils/apiResponse");

const {
  approveProductService,
  getAllPendingProductsService,
  rejectProductService,
} = require("./approvalService");

const getPendingProductsController = async (req, res) => {
  const pendingProducts = await getAllPendingProductsService(req);
  return apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending products retrieved successfully",
    data: [], // Replace with actual pending products data
  });
};

const approveProductController = async (req, res) => {
  // Logic to approve the product
  const approvedProduct = await approveProductService(req);

  return apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product approved successfully",
    data: approvedProduct,
  });
};

const rejectProductController = async (req, res) => {
  const { id } = req.params;
  // Logic to reject the product
  const rejectedProduct = await rejectProductService(req);
  return apiResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product rejected successfully",
    data: rejectedProduct,
  });
};

module.exports = {
  getPendingProductsController,
  approveProductController,
  rejectProductController,
};
