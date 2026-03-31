const { findSellerById } = require("../model/authModel");

const isSellerMiddleWare = async (req, res, next) => {
  const user = req.user;
  if (!user.roles.includes("seller")) {
    return res
      .status(403)
      .json({ message: "Access denied. Seller role required." });
  }

//   console.log(user);

  try {
    const seller = await findSellerById(user._id);

    console.log(seller);
    

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found." });
    }

    req.seller = seller;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error });
  }
};

module.exports = { isSellerMiddleWare };
