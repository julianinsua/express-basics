const express = require("express");
const { check } = require("express-validator/check");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.get("/signup", getSignup);
router.post(
  "/signup",
  check("email").isEmail().withMessage("Invalid email"),
  postSignup
);
router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/new-password/:token", getNewPassword);

module.exports = router;
