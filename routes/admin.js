const { Router } = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
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
    body("imageUrl", "Invalid Image URL").isURL(),
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
    body("imageUrl", "Invalid Image URL").isURL(),
    body("price", "Invalid price").isFloat(),
    body("description", "Invalid Description")
      .isLength({ min: 5, max: 250 })
      .trim(),
  ],
  isAuth,
  postEditProduct
);

router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
