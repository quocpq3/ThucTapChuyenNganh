var express = require("express");
var router = express.Router();

// middleware check login + role
// function useAuthenticated(req, res, next) {
//   if (!req.isAuthenticated()) {
//     return res.redirect("/login");
//   }

//   if (req.isAuthenticated()) {
//     return res.redirect("/booking");
//   }

//   next();
// }

/* GET booking page. */
// router.get("/", useAuthenticated, (req, res) => {
router.get("/", (req, res) => {
  res.render("home/booking", { title: "Đặt phòng" });
});

module.exports = router;
