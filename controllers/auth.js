const { createTransport } = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");
const crypto = require("crypto");
const { hash, compare } = require("bcryptjs");

const transporter = createTransport(
  sendgridTransport({
    auth: { api_key: process.env.MAILER_KEY },
  })
);

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }

      compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((e) => {
              if (e) {
                console.log(e);
              }
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((e) => {
          console.log(e);
          res.redirect("/login");
        });
    })
    .catch((e) => console.log(e));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign up",
    errorMessage: req.flash("error"),
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email currently in use");
        return res.redirect("/signup");
      }
      // I hate nested thens, I would rather use async await but i dont want to screw future parts of the course
      // TODO refactor to avoid nested .then blocks
      return hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then(() => {
      res.redirect("/login");
      return transporter
        .sendMail({
          to: email,
          from: "pepito@pepito.com",
          subject: "testing your mail",
          html: "<h1>Living on the edge</h1><p>Just testing some html</p>",
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email.");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 3600000 is an hour in miliseconds

        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: req.body.email,
          from: "pepito@pepito.com",
          subject: "Password Reset",
          html: `<h1>You requested a password change</h1>
<p>You requested a password Reset. Click on this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password..`,
        });
      })
      .catch((e) => console.log(e));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((e) => console.log(e));
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((newHashPassword) => {
      resetUser.password = newHashPassword;
      resetUser.resetToken = null;

      resetUser.save();
    })
    .catch((e) => console.log(e));
};
