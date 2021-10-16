const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const User = require("./models/user");
const { pageNotFound, get500 } = require("./controllers/errors");
const dotenv = require("dotenv");
dotenv.config();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

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
  .connect(process.env.API_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((e) => console.log(e));
