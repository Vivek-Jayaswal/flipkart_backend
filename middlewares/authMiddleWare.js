// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { findUserById } = require("../model/authModel");

const isAuthMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log(token);

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await findUserById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { isAuthMiddleWare };
