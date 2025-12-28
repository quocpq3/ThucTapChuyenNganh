const express = require("express");
const router = express.Router();

const Booking = require("../../models/Booking");
const Rooms = require("../../models/Rooms");

// Middleware check login
function useAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

router.get("/", useAuthenticated, (req, res) => {
  Rooms.find({ status: "Available" })
    .populate("roomType")
    .then((rooms) => {
      res.render("home/booking", {
        title: "Đặt phòng",
        rooms: rooms.map((r) => r.toObject()),
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading booking page");
    });
});

router.post("/", useAuthenticated, (req, res) => {
  Rooms.findById(req.body.room)
    .populate("roomType")
    .then((room) => {
      if (!room) {
        req.flash("error_message", "Phòng không tồn tại.");
        return res.redirect("/booking");
      }

      const checkIn = new Date(req.body.checkIn);
      const checkOut = new Date(req.body.checkOut);
      const nights =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

      if (nights <= 0) {
        req.flash("error_message", "Ngày trả phải lớn hơn ngày nhận.");
        return res.redirect("/booking");
      }

      const pricePerNight = room.roomType?.basePrice || room.basePrice || 0;
      const totalPrice = nights * pricePerNight;

      const booking = new Booking({
        user: req.user._id,
        room: room._id,
        checkIn,
        checkOut,
        guests: req.body.guests,
        totalPrice,
        status: "pending",
        guestName: req.user.name,
        guestPhone: req.user.phone,
      });

      return booking
        .save()
        .then(() => Rooms.findByIdAndUpdate(room._id, { status: "Occupied" }))
        .then(() => {
          req.flash("success_message", "Đặt phòng thành công!");
          res.redirect("/booking");
        });
    })
    .catch((err) => {
      console.error(err);
      req.flash("error_message", "Đặt phòng thất bại, thử lại sau.");
      res.redirect("/booking");
    });
});

module.exports = router;
