var express = require("express");
var router = express.Router();
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

// function useAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next(); // Proceed if authenticated
//   } else {
//     res.redirect("/login"); // Redirect to login if authentication fails
//   }
// }
//thêm check role
function useAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  if (req.isAuthenticated && req.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
}

router.get("/", useAuthenticated, (req, res) => {
  res.render("admin/index", { title: "admin" });
  next();
});

module.exports = router;
