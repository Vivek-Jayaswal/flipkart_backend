const { apiError } = require("../../utils/apiError");
const slugify = require("slugify");
const Product = require("../../schemas/productSchema");
const Brand = require("../../schemas/brandSchema");
const Category = require("../../schemas/categorySchema");
const Inventory = require("../../schemas/inventorySchema");

const generateSku = () => {
  return `SKU-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const {
  getSingleFile,
  getMultipleFiles,
  getFileUrl,
} = require("../../utils/fileHelprs");
const { createTags } = require("../../utils/createTags");

const createProductService = async (req) => {
  const sellerId = req.user._id;
  const { title, shortDescription, description, categories, brand } = req.body;

  if (!title || !shortDescription || !description || !categories || !brand) {
    throw apiError(400, "All product fields are required");
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const tags = createTags({ title });

  const brandData = await Brand.findById(brand);

  if (!brandData) {
    throw apiError(404, "Brand not found");
  }

  const categoryData = await Category.findById(categories);

  if (!categoryData) {
    throw apiError(404, "Category not found");
  }

  const thumbnail = getSingleFile(req.files, "thumbnail");
  if (!thumbnail) {
    throw apiError(400, "Thumbnail image is required");
  }

  const gallery = getMultipleFiles(req.files, "gallery");

  const tumbnailsUrl = {
    url: getFileUrl(req, thumbnail),
    public_id: thumbnail.filename,
  };

  const galleryUrls = gallery.map((file) => ({
    url: getFileUrl(req, file),
    public_id: file.filename,
  }));

  const product = await Product.create({
    seller: sellerId,
    title,
    slug,
    shortDescription,
    description,
    brand,
    category: categories,
    thumbnail: tumbnailsUrl,
    gallery: galleryUrls,
    tags,
  });

  return product;
};

const saveVariantsService = async (req) => {
  const { id } = req.params;

  const { variants } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw apiError(404, "Product not found");
  }

  product.variants = variants.map((variant) => ({
    sku: generateSku(),

    attributes: variant.attributes,

    price: variant.price,

    salePrice: variant.salePrice,

    isDefault: variant.isDefault,
  }));

  product.currentStep = 2;

  await product.save();

  return product;
};

const saveVariantImagesService = async (req) => {
  const { id: productId } = req.params;

  const { variantId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw apiError(404, "Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw apiError(404, "Variant not found");
  }

  const files = req.files?.variantImages || [];

  variant.images = files.map((file) => ({
    url: getFileUrl(req, file),
    public_id: file.filename,
  }));

  await product.save();

  return variant;
};

// const saveVariantWithImagesService = async (req) => {
//   const { id } = req.params;

//   const variants = JSON.parse(req.body.variants);

//   const product = await Product.findById(id);

//   if (!product) {
//     throw apiError(404, "Product not found");
//   }

//   const formattedVariants = variants.map((variant) => {
//     const images = req.files
//       .filter((file) => file.fieldname === `variant_${variant.tempId}`)
//       .map((file) => ({
//         url: getFileUrl(req, file),

//         public_id: file.filename,
//       }));

//     return {
//       sku: generateSKU(),

//       attributes: variant.attributes,

//       price: variant.price,

//       images,
//     };
//   });

//   product.variants = formattedVariants;

//   await product.save();

//   return product;
// };

const saveSpecificationsService = async (req) => {
  const { id } = req.params;

  const { specifications } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw apiError(404, "Product not found");
  }

  product.specifications = specifications;

  product.currentStep = 3;

  await product.save();

  return product;
};

const submitProductService = async (req) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw apiError(404, "Product not found");
  }

  if (!product.variants.length) {
    throw apiError(400, "Variants required");
  }

  const inventoryExists = await Inventory.exists({
    product: id,
  });

  if (!inventoryExists) {
    throw apiError(400, "Inventory required");
  }

  product.status = "pending";

  product.currentStep = 5;

  await product.save();

  return product;
};

const getAllProductService = async (req) => {
  const products = await Product.find().populate("category").populate("brand");
  return products;
};

module.exports = {
  createProductService,
  saveVariantsService,
  saveSpecificationsService,
  getAllProductService,
  submitProductService,
  saveVariantImagesService,
};
