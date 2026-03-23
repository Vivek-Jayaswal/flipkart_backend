const express = require("express");
require("dotenv").config();

// file import
const db = require("./db");
const authRouter = require("./router/authRouters");
const productRouter = require("./router/productRouter");

const app = express();

// middle ware
app.use(express.json());

app.use("/auth", authRouter);
app.use("/product", productRouter);

app.listen(8000, () => {
  console.log("server running on port 8000");
});
