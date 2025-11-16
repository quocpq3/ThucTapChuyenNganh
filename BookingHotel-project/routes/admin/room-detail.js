var express = require("express");
var router = express.Router();
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  const roomId = req.query.id;
  res.render("admin/room-detail", { title: "Room-detail", roomId: roomId });
});

module.exports = router;
