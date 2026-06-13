const { apiResponse } = require("../../utils/apiResponse");
const {
  createProductService,
  submitProductService,
  saveSpecificationsService,
  saveVariantsService,
  getAllProductService,
  saveVariantImagesService,
  saveInventoryService,
  getProductDetailsService,
} = require("./productService");

const createDraftProduct = async (req, res) => {
  const isProductCreated = await createProductService(req);

  return apiResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: isProductCreated,
  });
};

const saveVariants = async (req, res) => {
  const product = await saveVariantsService(req);

  return apiResponse(res, {
    statusCode: 200,
    message: "Variants saved",
    data: product,
  });
};

// const saveVariantsWithImages = async (req, res) => {
//   const product = await saveVariantWithImagesService(req);

//   return res.json({
//     success: true,
//     data: product,
//   });
// };

const saveVariantImages = async (req, res) => {
  const product = await saveVariantImagesService(req);

  return apiResponse(res, {
    statusCode: 200,
    message: "Variant images saved",
    data: product,
  });
};

const saveSpecifications = async (req, res) => {
  const product = await saveSpecificationsService(req);

  return apiResponse(res, {
    statusCode: 200,
    message: "Specifications saved",
    data: product,
  });
};

const saveInventory = async (req, res) => {
  const inventory = await saveInventoryService(req);

  return apiResponse(res, {
    statusCode: 200,
    message: "Inventory saved",
    data: inventory,
  });
};

const submitProductForApproval = async (req, res) => {
  const product = await submitProductService(req);

  return apiResponse(res, {
    statusCode: 200,
    message: "Product submitted for approval",
    data: product,
  });
};

const getAllProductController = async (req, res) => {
  const products = await getAllProductService(req);
  return apiResponse(res, {
    statusCode: 200,
    message: "Products fetched successfully",
    data: products,
  });
};

const getProductDetailsController = async (req, res) => {
  const product = await getProductDetailsService(req);
  return apiResponse(res, {
    statusCode: 200,
    message: "Products fetched successfully",
    data: product,
  });
};

module.exports = {
  createDraftProduct,
  saveVariants,
  saveSpecifications,
  getAllProductController,
  saveInventory,
  submitProductForApproval,
  saveVariantImages,
  getProductDetailsController,
};
