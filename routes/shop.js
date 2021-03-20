const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const { products } = adminData;
  res.render("shop", {
    products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productsCSS: true,
  });
});

module.exports = router;
