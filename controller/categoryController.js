const slugify = require("slugify");
const {
  findCategoryByCategoryId,
  createCategory,
  findCategoryByParentCategoryId,
  findAllCategoriesByCategoryId,
  findCategoryByCategoryIdAndDelete,
  findAllCategories,
} = require("../model/categoryModel");

const createCategoryController = async (req, res) => {
  const { name, isFeatured, parentCategory } = req.body;
  const user = req.user;

  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can create categories",
      status: 403,
    });
  }

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // GENERATE SLUG
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    let level = 1;

    // IF HAS PARENT
    if (parentCategory) {
      const parent = await findCategoryByParentCategoryId(parentCategory);

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }

      level = parent.level + 1;
    }

    // CREATE CATEGORY
    const category = await createCategory({
      name,
      slug,
      parentCategory: parentCategory || null,
      level,
      isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
      createdBy: user._id,
      updateHistory: [],
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategoryController = async (req, res) => {
  const { name, isFeatured, parentCategory, categoryId } = req.body;
  const user = req.user;

  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can update categories",
      status: 403,
    });
  }

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (parentCategory && parentCategory === categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be its own parent",
      });
    }

    const category = await findCategoryByCategoryId(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // GENERATE SLUG
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    let level = 1;

    // IF HAS PARENT
    if (parentCategory) {
      const parent = await findCategoryByParentCategoryId(parentCategory);

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }

      level = parent.level + 1;
    }

    // CHANGE TRACKING
    const changes = [];

    // NAME
    if (name && category?.name !== name) {
      changes.push(`Name changed from ${category.name} to "${name}"`);
    }

    // FEATURED
    if (
      typeof isFeatured === "boolean" &&
      category?.isFeatured !== isFeatured
    ) {
      changes.push(
        `Featured status changed from ${category.isFeatured} to ${isFeatured}`,
      );
    }

    // PARENT CATEGORY
    if (
      parentCategory &&
      category?.parentCategory?.toString() !== parentCategory
    ) {
      changes.push("Parent category updated");
    }

    if (category?.parentCategory && !parentCategory) {
      changes.push("Parent category removed");
    }

    // UPDATE CATEGORY
    category.name = name;
    category.slug = slug;
    category.parentCategory = parentCategory || null;
    category.level = level;
    category.updatedBy = user._id;
    category.isFeatured =
      typeof isFeatured === "boolean" ? isFeatured : category.isFeatured;
    category.updateHistory.push({
      updatedBy: user._id,
      updatedAt: new Date(),
      changes: changes.length > 0 ? changes.join(", ") : "No changes",
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteCategoryController = async (req, res) => {
  const user = req.user;

  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can delete categories",
      status: 403,
    });
  }

  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Category id is required",
    });
  }

  try {
    const category = await findCategoryByCategoryId(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const childCategories = await findAllCategoriesByCategoryId(req.params.id);

    if (childCategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with child categories",
      });
    }

    // OPTIONAL:
    // CHECK PRODUCTS USING CATEGORY
    /*
    const products =
      await Product.find({
        category: categoryId
      });

    if (products.length > 0) {

      return res.status(400).json({

        success: false,

        message:
          "Cannot delete category with products",
      });
    }
    */

    await findCategoryByCategoryIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  const user = req.user;
  if (!user.roles.includes("admin") && !user.roles.includes("seller")) {
    return res.status(403).json({
      message: "Only admins and sellers can access categories",
      status: 403,
    });
  }

  try {
    const categories = await findAllCategories();

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleCategoryController = async (req, res) => {
  const user = req.user;
  if (!user.roles.includes("admin") && !user.roles.includes("seller")) {
    return res.status(403).json({
      message: "Only admins and sellers can access categories",
      status: 403,
    });
  }

  try {
    const category = await findCategoryByCategoryId(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getSingleCategoryController,
};
