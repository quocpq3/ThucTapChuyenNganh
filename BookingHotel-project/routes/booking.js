var express = require("express");
var router = express.Router();

/* GET booking page. */
router.get("/", function (req, res, next) {
  res.render("home/booking", { title: "Đặt phòng" });
});

module.exports = router;
