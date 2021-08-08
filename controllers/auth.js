const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign up",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6104165d48e03fc6ff55d477")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((e) => {
        if (e) {
          console.log(e);
        }
        res.redirect("/");
      });
    })
    .catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
