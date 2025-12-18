var express = require("express");
var router = express.Router();

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

// middleware check login + role
function useAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  if (req.user.role !== "admin") {
    return res.redirect("/");
  }

  next();
}

router.get("/", useAuthenticated, (req, res) => {
  res.render("admin/index", { title: "Admin Dashboard" });
});

module.exports = router;
