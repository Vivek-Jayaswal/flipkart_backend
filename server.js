const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

// file import
const db = require("./db");
const authRouter = require("./router/authRouters");
const categoryRouter = require("./router/categoryRouter");
const brandRouter = require("./router/brandRouter");
const productRouter = require("./modules/product/product.route");
const approvalRouter = require("./modules/product-approval/approval.route");
const { default: errorHandler } = require("./utils/errorHandler");

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.LIVE_FRONTEND_URL,
    // origin: process.env.LOCAL_FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/brand", brandRouter);
app.use("/approval", approvalRouter);

app.use(errorHandler);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
