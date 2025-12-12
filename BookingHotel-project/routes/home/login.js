var express = require("express");
var router = express.Router();
const User = require("../../models/User");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("home/login", { title: "Đăng nhập" });
});

module.exports = router;
