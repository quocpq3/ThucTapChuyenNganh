var express = require("express");
var router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

// Set layout admin cho tất cả route
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

// Route trang admin
router.get("/", auth, isAdmin, (req, res) => {
  res.render("admin/index", { title: "Admin Dashboard" });
});

module.exports = router;
