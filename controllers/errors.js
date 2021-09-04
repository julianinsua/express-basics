exports.pageNotFound = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "random",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "random",
    isAuthenticated: req.session.isLoggedIn,
  });
};
