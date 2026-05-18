const categorySchema = require("../schemas/categorySchema");

const findCategoryByParentCategoryId = async (categoryId) => {
  return await categorySchema.findById({ _id: categoryId });
};

const createCategory = async (categoryData) => {
  const categoryObj = new categorySchema({
    name: categoryData.name,
    slug: categoryData.slug,
    parentCategory: categoryData.parentCategory,
    level: categoryData.level,
    isFeatured: categoryData.isFeatured,
    createdBy: categoryData.createdBy,
    updateHistory: categoryData.updateHistory,
  });

  return await categoryObj.save();
};

const findCategoryByCategoryId = async (categoryId) => {
  return await categorySchema.findById({ _id: categoryId });
};

const findAllCategoriesByCategoryId = async (categoryId) => {
  return await categorySchema.find({ parentCategory: categoryId });
};

const findCategoryByCategoryIdAndDelete = async (categoryId) => {
  return await categorySchema.findByIdAndDelete({ _id: categoryId });
};

const findAllCategories = async () => {
  return await categorySchema.find();
};

module.exports = {
  findCategoryByParentCategoryId,
  findCategoryByCategoryId,
  findAllCategoriesByCategoryId,
  createCategory,
  findCategoryByCategoryIdAndDelete,
  findAllCategories,
};
