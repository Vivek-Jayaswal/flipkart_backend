const slugify = require("slugify");
const fs = require("fs");
const {
  findBrandName,
  createBrand,
  findBrandByName,
  updateBrand,
  findBrandByBrandId,
  findBrandByBrandIdInProducts,
  findBrandByBrandIdAndDelete,
  findAllBrands,
} = require("../model/brandModel");

const createBrandController = async (req, res) => {
  const { name, description, logo, website, status, isFeatured } = req?.body;
  const user = req.user;

  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can create Brands",
      status: 403,
    });
  }

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    // GENERATE SLUG

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const isBrandExist = await findBrandByName(name);

    if (isBrandExist?.name === name) {
      if (req?.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: "Brand with this name already exists",
      });
    }

    const logoPath = req?.file?.path;
    const logoURL = `${req.protocol}://${req.get("host")}/${req.file.path}`;
    const brand = await createBrand({
      name,
      description,
      logo: logoURL,
      logoPath: logoPath,
      slug,
      website,
      status,
      isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
      createdBy: user._id,
      updateHistory: [],
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    if (req?.file?.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBrandController = async (req, res) => {
  const { name, description, logo, website, status, isFeatured } = req?.body;
  const user = req.user;

  const brandId = req?.params.id;
  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can update Brands",
      status: 403,
    });
  }

  if (!brandId) {
    return res.status(400).json({
      success: false,
      message: "Brand id is required",
    });
  }

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    // GENERATE SLUG

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const brand = await findBrandByBrandId(brandId);

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: "Brand Not found",
      });
    }

    if (brand?.name === name) {
      return res.status(400).json({
        success: false,
        message: "Brand with this name already exists in another brand",
      });
    }

    if (req.file.path && brand?.logoPath) {
      if (fs.existsSync(brand.logoPath)) {
        fs.unlinkSync(brand.logoPath);
      }
    }

    const logoPath = req?.file?.path;
    const logoURL = `${req.protocol}://${req.get("host")}/${req.file.path}`;

    brand.name = name || brand.name;
    brand.description = description || brand.description;
    brand.logo = logoURL || brand.logo;
    brand.logoPath = logoPath || brand.logoPath;
    brand.slug = slug || brand.slug;
    brand.website = website || brand.website;
    brand.status = status || brand.status;
    brand.isFeatured =
      typeof isFeatured === "boolean" ? isFeatured : brand.isFeatured;
    brand.updatedBy = user._id;
    brand.updateHistory.push({
      updatedBy: user._id,
      updatedAt: new Date(),
      changes: `Brand updated with name: ${name}, description: ${description}, website: ${website}, status: ${status}, isFeatured: ${isFeatured}`,
    });

    const updatedBrand = await updateBrand(brand);

    res.status(201).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (error) {
    if (req?.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBrandController = async (req, res) => {
  const user = req.user;

  if (!user.roles.includes("admin")) {
    return res.status(403).json({
      message: "Only admins can delete Brands",
      status: 403,
    });
  }

  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Brand id is required",
    });
  }

  try {
    const brand = await findBrandByBrandId(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    const products = await findBrandByBrandIdInProducts(req.params.id);

    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete brand with products",
      });
    }

    await findBrandByBrandIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBrandsController = async (req, res) => {
  const user = req.user;
  if (!user.roles.includes("admin") && !user.roles.includes("seller")) {
    return res.status(403).json({
      message: "Only admins and sellers can access categories",
      status: 403,
    });
  }

  try {
    const brands = await findAllBrands();
    res.status(200).json({
      success: true,
      message: "Brands retrieved successfully",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleBrandController = async (req, res) => {
  const user = req.user;
  if (!user.roles.includes("admin") && !user.roles.includes("seller")) {
    return res.status(403).json({
      message: "Only admins and sellers can access categories",
      status: 403,
    });
  }

  try {
    const brand = await findBrandByBrandId(req.params.id);
    res.status(200).json({
      success: true,
      message: "Brand retrieved successfully",
      data: brand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBrandController,
  updateBrandController,
  deleteBrandController,
  getAllBrandsController,
  getSingleBrandController,
};
