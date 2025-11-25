var express = require("express");
var router = express.Router();
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  // Hỗ trợ cả 'id' và 'room' trong query parameter
  const roomId = req.query.id || req.query.room;
  res.render("admin/room-detail", { title: "Room-detail", roomId: roomId });
});

module.exports = router;
