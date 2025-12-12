var express = require("express");
var router = express.Router();
const User = require("../../models/User");
const bcryptjs = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//app register
router.get("/", function (req, res, next) {
  res.render("home/register", { title: "Đăng ký" });
});

module.exports = router;
