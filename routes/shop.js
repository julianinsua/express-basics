const { Router } = require("express");
const isAuth = require("../middleware/is-auth");
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
  getInvoice,
} = require("../controllers/shop");

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProductDetails);

router.post("/cart", isAuth, postCart);

router.get("/cart", isAuth, getCart);

router.post("/cart-delete-item", isAuth, postDeleteCartItem);

router.get("/orders", isAuth, getOrders);

router.post("/create-order", isAuth, postOrder);

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
