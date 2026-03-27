const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

// file import
const db = require("./db");
const authRouter = require("./router/authRouters");
const productRouter = require("./router/productRouter");

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/product", productRouter);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
