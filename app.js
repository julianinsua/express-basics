const path = require("path");
const express = require("express");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const { pageNotFound } = require("./controllers/404");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const store = new SessionStore({
  uri: process.env.API_URL,
  collection: "sessions",
});

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

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((e) => console.log(e));
  } else {
    next();
  }
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

mongoose
  .connect(process.env.API_URL, { useNewUrlParser: true })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Julian",
          email: "test@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((e) => console.log(e));
