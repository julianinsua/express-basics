const path = require("path");
const express = require("express");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const csrf = require("csurf");
const flash = require("connect-flash");
const User = require("./models/user");
const { pageNotFound, get500 } = require("./controllers/errors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const store = new SessionStore({
  uri: process.env.API_URL,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch((e) => {
        throw new Error(e);
      });
  } else {
    next();
  }
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.get("/500", get500);
app.use((error, req, res, next) => {
  return res.redirect("/500");
});
app.use(pageNotFound);

mongoose
  .connect(process.env.API_URL, { useNewUrlParser: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
