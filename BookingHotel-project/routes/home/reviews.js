const express = require("express");
const router = express.Router();
const Review = require("../../models/Review");
const Amenity = require("../../models/Amenity");
const Endow = require("../../models/Endow");
const Rooms = require("../../models/Rooms");

router.get("/", function (req, res) {
  Promise.all([
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
  ])
    .then(([amenities, endows, rooms, reviews]) => {
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
        reviews, // Gửi review vào template
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error loading data");
    });
});

router.post("/", (req, res) => {
  if (!req.user) return res.redirect("/login");

  const rating = Math.max(1, Math.min(5, Number(req.body.rating) || 5));
  const comment = String(req.body.comment || "").trim();

  const review = new Review({
    user: req.user._id,
    rating,
    comment,
    status: "approved",
  });

  review
    .save()
    .then(() => res.redirect("/#testimonials"))
    .catch((err) => {
      console.error(err);
      res.redirect("/#testimonials");
    });
});

module.exports = router;
