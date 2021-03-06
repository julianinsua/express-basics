const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProductDetails,
  postCart,
  postDeleteCartItem,
  postOrder,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.post("/cart", postCart);

router.get("/cart", getCart);

router.post("/cart-delete-item", postDeleteCartItem);

router.get("/orders", getOrders);

router.post("/create-order", postOrder);

module.exports = router;
