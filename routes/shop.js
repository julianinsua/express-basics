const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProductDetails,
  postCart,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.post("/cart", postCart);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

module.exports = router;
