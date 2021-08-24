const express = require("express");
const router = express.Router();
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

router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/new-password/:token", getNewPassword);

module.exports = router;
