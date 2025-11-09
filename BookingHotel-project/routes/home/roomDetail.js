var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("home/room-detail", { title: "Chi tiết phòng" });
});

module.exports = router;
