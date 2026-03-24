const productSchema = require("../schemas/productSchema");

const createProduct = ({
  name,
  description,
  brand,
  category,
  price,
  discountPrice,
  stock,
  imagePath,
  imageURL,
  seller,
  ratings,
  numReviews,
  //   isActive = true,
}) => {
  return new Promise(async (resolve, reject) => {
    const productObj = new productSchema({
      name: name,
      description: description,
      brand: brand,
      category: category,
      price: price,
      discountPrice: discountPrice,
      stock: stock,
      imagePath: imagePath,
      imageURL: imageURL,
      seller: seller,
      ratings: ratings,
      numReviews: numReviews,
      //   isActive: isActive,
    });

    try {
      const productCreated = await productObj.save(productObj);
      resolve(productCreated);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await productSchema.find();
      resolve(product);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { createProduct, getAllProduct };
