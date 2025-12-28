const express = require("express");
const router = express.Router();
const Rooms = require("../../models/Rooms");
const Amenity = require("../../models/Amenity");
const Endow = require("../../models/Endow");
const Review = require("../../models/Review");

router.get("/", async (req, res) => {
  try {
    const [amenities, endows, rooms, reviewsRaw] = await Promise.all([
      Amenity.find({}).limit(8).lean(),
      Endow.find({ status: true }).limit(3).lean(),
      Rooms.find({})
        .populate({
          path: "roomType",
          populate: { path: "amenities" },
        })
        .limit(4)
        .lean(),
      Review.find({ status: "approved" }).populate("user").limit(3).lean(),
    ]);

    // Thêm mảng stars cho mỗi review
    const reviews = reviewsRaw.map((r) => ({
      ...r,
      stars: Array.from({ length: r.rating }), // mảng có r.rating phần tử
    }));

    const endowData = endows.map((e) => ({
      ...e,
      isPercent: e.type === "percent",
      isAmount: e.type === "amount",
      isCombo: e.type === "combo",
      amenityList: e.amenity ? e.amenity.split(",").map((a) => a.trim()) : [],
    }));

    res.render("home/index", {
      title: "Trang chủ",
      amenities,
      endows: endowData,
      rooms,
      reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading data");
  }
});

module.exports = router;
