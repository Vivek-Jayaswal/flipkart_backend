const jwt = require("jsonwebtoken");

const tempAuthMiddleware = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No Token Provided!",
      status: 401,
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decode.purpose !== "email_verification") {
      return res.status(403).json({
        message: "Invalid token purpose!",
        status: 403,
      });
    }

    req.tempUser = decode;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token Expired!",
        status: 401,
      });
    }

    return res.status(401).json({
      message: "Invalid Token",
      status: 401,
    });
  }
};

module.exports = { tempAuthMiddleware };
