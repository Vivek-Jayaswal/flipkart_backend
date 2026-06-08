// backend/
// │
// ├── src/
// │
// │   ├── config/
// │   │   ├── db.js
// │   │   ├── cloudinary.js
// │   │   └── redis.js
// │   │
// │   ├── middlewares/
// │   │   ├── auth.middleware.js
// │   │   ├── role.middleware.js
// │   │   └── upload.middleware.js
// │   │
// │   ├── modules/
// │   │
// │   │   ├── auth/
// │   │   │   ├── auth.controller.js
// │   │   │   ├── auth.service.js
// │   │   │   ├── auth.route.js
// │   │   │   └── auth.validation.js
// │   │   │
// │   │   ├── product/
// │   │   │   ├── product.controller.js
// │   │   │   ├── product.service.js
// │   │   │   ├── product.route.js
// │   │   │   └── product.validation.js
// │   │   │
// │   │   ├── review/
// │   │   ├── inventory/
// │   │   ├── category/
// │   │   ├── brand/
// │   │   ├── order/
// │   │   ├── cart/
// │   │   ├── wishlist/
// │   │   └── coupon/
// │   │
// │   ├── models/
// │   │   ├── User.js
// │   │   ├── Product.js
// │   │   ├── Review.js
// │   │   ├── Inventory.js
// │   │   └── Order.js
// │   │
// │   ├── utils/
// │   │   ├── ApiError.js
// │   │   ├── ApiResponse.js
// │   │   ├── slugify.js
// │   │   └── generateSKU.js
// │   │
// │   ├── app.js
// │   │
// │   └── server.js
// │
// ├── uploads/
// ├── .env
// └── package.json




const slugify = require("slugify");

const Product = require("../../schemas/productSchema");
const Brand = require("../../schemas/brandSchema");
const Category = require("../../schemas/categorySchema");

const { apiError } = require("../../utils/apiError");

const {
  getSingleFile,
  getMultipleFiles,
  getFileUrl,
} = require("../../utils/fileHelpers");

const { createTags } = require("../../utils/createTags");

const createDraftProductService = async (req) => {
  const sellerId = req.user._id;

  const {
    title,
    shortDescription,
    description,
    brand,
    category,
  } = req.body;

  // -----------------------------
  // Basic Validation
  // -----------------------------

  if (
    !title ||
    !shortDescription ||
    !description ||
    !brand ||
    !category
  ) {
    throw apiError(
      400,
      "All required fields must be provided"
    );
  }

  // -----------------------------
  // Thumbnail Validation
  // -----------------------------

  const thumbnail = getSingleFile(
    req.files,
    "thumbnail"
  );

  if (!thumbnail) {
    throw apiError(
      400,
      "Thumbnail is required"
    );
  }

  // -----------------------------
  // Gallery
  // -----------------------------

  const gallery =
    getMultipleFiles(
      req.files,
      "gallery"
    ) || [];

  // -----------------------------
  // Brand Validation
  // -----------------------------

  const brandData =
    await Brand.findById(brand);

  if (!brandData) {
    throw apiError(
      404,
      "Brand not found"
    );
  }

  // -----------------------------
  // Category Validation
  // -----------------------------

  const categoryData =
    await Category.findById(category);

  if (!categoryData) {
    throw apiError(
      404,
      "Category not found"
    );
  }

  // -----------------------------
  // Slug Generation
  // -----------------------------

  let slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const existingSlug =
    await Product.findOne({
      slug,
    });

  if (existingSlug) {
    slug =
      slug +
      "-" +
      Date.now();
  }

  // -----------------------------
  // Tags Generation
  // -----------------------------

  const tags = createTags({
    title,
    brandName:
      brandData.name,
    categoryName:
      categoryData.name,
  });

  // -----------------------------
  // Image URL
  // -----------------------------

  const thumbnailUrl = {
    url: getFileUrl(
      req,
      thumbnail
    ),
    public_id:
      thumbnail.filename,
  };

  const galleryUrls =
    gallery.map((file) => ({
      url: getFileUrl(
        req,
        file
      ),
      public_id:
        file.filename,
    }));

  // -----------------------------
  // Product Create
  // -----------------------------

  const product =
    await Product.create({
      seller: sellerId,

      title,
      slug,

      shortDescription,
      description,

      brand,
      category,

      thumbnail:
        thumbnailUrl,

      gallery:
        galleryUrls,

      tags,

      status: "draft",

      currentStep: 1,
    });

  return product;
};

module.exports = {
  createDraftProductService,
};