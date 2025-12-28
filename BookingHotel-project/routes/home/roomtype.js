var express = require("express");
var router = express.Router();
const RoomType = require("../../models/RoomType");

router.get("/roomtype-list", function (req, res) {
  RoomType.find({ status: true })
    .populate("amenities")
    .lean()
    .then((roomtypes) => {
      res.render("home/roomtype/roomtype-list", {
        title: "Danh sách loại phòng",
        roomtypes,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error loading room types");
    });
});

module.exports = router;
