const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { mongoConnect } = require("./util/database");
const { pageNotFound } = require("./controllers/404");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((e) => console.log(e));
  next();
});

app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(pageNotFound);

mongoConnect().then(() => {
  app.listen(3000);
});
