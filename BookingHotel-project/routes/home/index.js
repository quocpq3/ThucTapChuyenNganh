var express = require("express");
var router = express.Router();
const Rooms = require("../../models/Rooms");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("home/index", { title: "Trang chủ" });
});

// router.get("/", async (req, res) => {
//   const rooms = await Rooms.find({ status: "Available" })
//     .populate("roomType")
//     .lean();

//   res.render("home/index", {
//     title: "Danh sách phòng",
//     rooms,
//   });
// });

module.exports = router;
