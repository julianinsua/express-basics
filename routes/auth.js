const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
} = require("../controllers/auth");

router.get("/login", getLogin);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.get("/signup", getSignup);

module.exports = router;
