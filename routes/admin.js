const { Router } = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

const router = Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title", "Invalid Title").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid price").isFloat(),
    body("description", "Invalid Description")
      .isLength({ min: 5, max: 250 })
      .trim(),
  ],
  isAuth,
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Invalid Title").isString().isLength({ min: 3 }).trim(),
    body("price", "Invalid price").isFloat(),
    body("description", "Invalid Description")
      .isLength({ min: 5, max: 250 })
      .trim(),
  ],
  isAuth,
  postEditProduct
);

router.delete("/product/:productId", isAuth, deleteProduct);

module.exports = router;
