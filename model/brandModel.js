const brandSchema = require("../schemas/brandSchema");
const userSchema = require("../schemas/userSchema");

const findBrandByName = async (name) => {
  return await brandSchema.findOne({ name: name });
};

const createBrand = async (brandData) => {
  // console.log("Creating brand with data:", brandData);
  const brandObj = new brandSchema({
    name: brandData.name,
    description: brandData.description,
    logo: brandData.logo,
    logoPath: brandData.logoPath,
    slug: brandData.slug,
    website: brandData.website,
    status: brandData.status,
    isFeatured: brandData.isFeatured,
    createdBy: brandData.createdBy,
    updateHistory: brandData.updateHistory,
  });

  console.log("Brand Object to be saved:", brandObj);

  return await brandObj.save();
};

const updateBrand = async (brand) => {
  return await brand.save();
};

const findBrandByBrandId = async (brandId) => {
  return await brandSchema.findById({ _id: brandId });
};

const findBrandByBrandIdInProducts = async (brandId) => {
  return await userSchema.find({ brandId: brandId });
};

const findBrandByBrandIdAndDelete = async (brandId) => {
  return await brandSchema.findByIdAndDelete({ _id: brandId });
};

const findAllBrands = async () => {
  return await brandSchema.find();
};

module.exports = {
  findBrandByName,
  findBrandByBrandId,
  createBrand,
  findBrandByBrandIdAndDelete,
  findBrandByBrandIdInProducts,
  findAllBrands,
  updateBrand,
};
