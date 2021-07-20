const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const User = require("./models/user");
const { pageNotFound } = require("./controllers/404");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   User.findById("60e8ea6b8261797664b78f0e")
//     .then((user) => {
//       const { username, email, cart, _id } = user;
//       req.user = new User(username, email, cart, _id);
//       next();
//     })
//     .catch((e) => console.log(e));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

mongoose
  .connect(process.env.API_URL)
  .then((result) => app.listen(3000))
  .catch((e) => console.log(e));
