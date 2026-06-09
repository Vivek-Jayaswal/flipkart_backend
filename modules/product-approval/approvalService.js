const Product = require("../../schemas/productSchema");

const { apiError } = require("../../utils/apiError");

const getAllPendingProductsService = async (req) => {
  const { roles } = req.user;

  if (!roles?.includes("admin")) {
    throw apiError(403, "Unauthorized");
  }

  const pendingProducts = await Product.find({ status: "pending" })
    .populate("seller", "name email")
    .populate("category", "name")
    .populate("brand", "name")
    .lean();

  return pendingProducts;
};

const approveProductService = async (req) => {
  const { roles } = req.user;
  const { id } = req.params;

  if (!roles?.includes("admin")) {
    throw apiError(403, "Unauthorized");
  }

  const product = await Product.findById(id);

  if (!product) {
    throw apiError(404, "Product not found");
  }

  if (product.status === "approved") {
    throw apiError(400, "Product is already approved");
  }

  product.approvedBy = req.user._id;
  product.status = "approved";
  await product.save();

  return product;
};

const rejectProductService = async (req) => {
  const { roles } = req.user;
  const { id } = req.params;
  const { rejectReason } = req.body;

  if (!roles?.includes("admin")) {
    throw apiError(403, "Unauthorized");
  }

  const product = await Product.findById(id);

  if (!rejectReason) {
    throw apiError(400, "Reject reason is required");
  }

  if (!product) {
    throw apiError(404, "Product not found");
  }

  if (product.status === "rejected") {
    throw apiError(400, "Product is already rejected");
  }

  product.status = "rejected";
  product.rejectionReason = rejectReason;
  product.rejectedBy = req.user._id;
  await product.save();

  return product;
};

module.exports = {
  getAllPendingProductsService,
  approveProductService,
  rejectProductService,
};
