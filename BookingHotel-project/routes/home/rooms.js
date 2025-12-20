var express = require("express");
var router = express.Router();
const Rooms = require("../../models/Rooms");
const Amenity = require("../../models/Amenity");

router.get("/room-list", function (req, res) {
  //dùng promise để lấy dữ liệu của nhiều collection cùng lúc
  Promise.all([
    Amenity.find({}).lean(),
    Rooms.find({})
      .populate({
        path: "roomType",
        populate: {
          path: "amenities",
        },
      })
      .lean(),
  ])
    .then(([amenities, rooms]) => {
      res.render("home/rooms/room-list", {
        title: "Danh sách phòng",
        amenities,
        rooms,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error loading data");
    });
});
//route detail
router.get("/room-detail/:id", async (req, res) => {
  const room = await Rooms.findById(req.params.id)
    .populate({
      path: "roomType",
      populate: {
        path: "amenities",
        match: { status: true },
      },
    })
    .lean();
  console.log("ROOM =", JSON.stringify(room, null, 2));

  res.render("home/rooms/room-detail", {
    title: "Chi tiết phòng",
    room,
  });
});

module.exports = router;
