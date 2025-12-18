var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//app login
passport.use(
  new LocalStrategy({ usernameField: "email" }, function (
    email,
    password,
    done
  ) {
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return done(null, false, { message: "User not found." });
      }
      bcryptjs.compare(password, user.password, (err, matched) => {
        if (err) return err;
        if (matched) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Wrong email or password." });
        }
      });
    });
  })
);

// check role
router.post("/login", (req, res, next) => {
  let errors = [];
  if (!req.body.email) {
    errors.push({ message: "Please enter email" });
  }
  if (!req.body.password) {
    errors.push({ message: "Please enter password" });
  }
  if (errors.length > 0) {
    return res.render("home/login", {
      title: "Login",
      errors: errors,
      email: req.body.email,
      password: req.body.password,
    });
  }
  passport.authenticate("local", (err, user, info) => {
    if (!user) return res.redirect("/login");

    req.logIn(user, () => {
      res.redirect(user.role === "admin" ? "/admin" : "/");
    });
  })(req, res, next);
});

//app register
router.post("/register", (req, res, next) => {
  let errors = [];
  if (!req.body.name) {
    errors.push({ message: "Name is required " });
  }
  if (!req.body.phone) {
    errors.push({ message: "Phone is required " });
  }
  if (!req.body.email) {
    errors.push({ message: "E-mail is required" });
  }
  if (errors.length > 0) {
    res.render("home/register", {
      title: "Register",
      errors: errors,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      role: req.body.role,
      password: req.body.password,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        const newUser = new User({
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          role: req.body.role ? req.body.role : "user",
          password: req.body.password,
        });
        bcryptjs.genSalt(10, function (err, salt) {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save().then((saveUser) => {
              req.flash("success_message", "Successfully registered!");
              res.redirect("/login");
            });
          });
        });
      } else {
        req.flash("error_message", "E-mail already exist!");
        res.redirect("/login");
      }
    });
  }
});
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).send(err); // Handle the error appropriately
    }
    res.redirect("/"); // Redirect after logout
  });
});
module.exports = router;
