var express = require("express");
var router = express.Router();
const Rooms = require("../../models/Rooms");

router.get("/", function (req, res, next) {
  res.render("home/room-detail", { title: "Chi tiết phòng" });
});
// router.get("/:id", async (req, res) => {
//   const room = await Rooms.findById(req.params.id)
//     .populate({
//       path: "roomType",
//       populate: {
//         path: "amenities",
//         match: { status: true },
//       },
//     })
//     .lean();
//   res.render("home/room-detail", {
//     title: "Chi tiết phòng",
//     room,
//   });
// });

module.exports = router;
