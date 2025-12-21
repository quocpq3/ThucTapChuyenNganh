var express = require("express");
var router = express.Router();

const Booking = require("../../models/Booking");
const Rooms = require("../../models/Rooms");

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

/* ===================== LIST ===================== */
router.get("/", function (req, res) {
  Booking.find({})
    .populate("user", "name phone")
    .populate({
      path: "room",

      populate: { path: "roomType", select: "name basePrice" },
    })
    .then((bookings) => {
      const data = bookings.map((b, index) => ({
        ...b.toObject(),
        stt: index + 1,

        guestName: b.guestName,
        guestPhone: b.guestPhone,
        guestEmail: b.guestEmail,

        checkInFormatted: new Date(b.checkIn).toLocaleDateString("vi-VN"),
        checkOutFormatted: new Date(b.checkOut).toLocaleDateString("vi-VN"),
        totalPriceFormatted: b.totalPrice.toLocaleString("vi-VN") + " ₫",

        isPending: b.status === "pending",
        isConfirmed: b.status === "confirmed",
        isCancelled: b.status === "cancelled",
        isCheckedIn: b.status === "checked_in",
        isCheckedOut: b.status === "checked_out",
      }));

      res.render("admin/bookings/bookings-list", { bookings: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading bookings list");
    });
});

/* ===================== CREATE ===================== */
router.get("/create", function (req, res) {
  Rooms.find({ status: "Available" })
    .populate("roomType")
    .then((rooms) => {
      res.render("admin/bookings/create", {
        rooms: rooms.map((r) => r.toObject()),
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading create booking page");
    });
});

router.post("/create", function (req, res) {
  Rooms.findById(req.body.room)
    .populate("roomType")
    .then((room) => {
      if (!room) return res.send("Room not found");

      const checkIn = new Date(req.body.checkIn);
      const checkOut = new Date(req.body.checkOut);
      const nights =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

      if (nights <= 0) {
        return res.send("Ngày trả phải lớn hơn ngày nhận");
      }

      const pricePerNight = room.roomType?.basePrice || 0;
      const totalPrice = nights * pricePerNight;

      const booking = new Booking({
        user: null,
        guestName: req.body.guestName,
        guestPhone: req.body.guestPhone,
        guestEmail: req.body.guestEmail,
        room: req.body.room,
        checkIn,
        checkOut,
        guests: req.body.guests,
        totalPrice,
        status: req.body.status,
      });

      return booking
        .save()
        .then(() => Rooms.findByIdAndUpdate(room._id, { status: "Occupied" }));
    })
    .then(() => res.redirect("/admin/bookings"))
    .catch((err) => {
      console.error(err);
      res.send("Create booking failed");
    });
});

/* ===================== EDIT ===================== */
router.get("/edit/:id", function (req, res) {
  Promise.all([
    Booking.findById(req.params.id),
    Rooms.find({}).populate("roomType"),
  ])
    .then(([booking, rooms]) => {
      rooms.forEach((r) => {
        r.selected = r._id.toString() === booking.room.toString();
      });

      res.render("admin/bookings/edit", {
        booking: {
          ...booking.toObject(),
          checkInFormatted: new Date(booking.checkIn)
            .toISOString()
            .split("T")[0],
          checkOutFormatted: new Date(booking.checkOut)
            .toISOString()
            .split("T")[0],

          isPending: booking.status === "pending",
          isConfirmed: booking.status === "confirmed",
          isCancelled: booking.status === "cancelled",
          isCheckedIn: booking.status === "checked_in",
          isCheckedOut: booking.status === "checked_out",
        },
        rooms: rooms.map((r) => r.toObject()),
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading edit booking page");
    });
});

router.put("/edit/:id", function (req, res) {
  Rooms.findById(req.body.room)
    .populate("roomType")
    .then((room) => {
      if (!room) return res.send("Room not found");

      const checkIn = new Date(req.body.checkIn);
      const checkOut = new Date(req.body.checkOut);
      const nights =
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

      if (nights <= 0) {
        return res.send("Ngày trả phải lớn hơn ngày nhận");
      }

      const totalPrice = nights * (room.roomType?.basePrice || 0);

      return Booking.findByIdAndUpdate(req.params.id, {
        guestName: req.body.guestName,
        guestPhone: req.body.guestPhone,
        guestEmail: req.body.guestEmail,

        room: room._id,
        checkIn,
        checkOut,
        guests: req.body.guests,
        totalPrice,
        status: req.body.status,
      });
    })
    .then(() => res.redirect("/admin/bookings"))
    .catch((err) => {
      console.error(err);
      res.send("Update booking failed");
    });
});

/* ===================== DELETE ===================== */
router.delete("/:id", function (req, res) {
  Booking.findById(req.params.id)
    .then((booking) => {
      if (!booking) return;

      return Rooms.findByIdAndUpdate(booking.room, {
        status: "Available",
      }).then(() => Booking.findByIdAndDelete(req.params.id));
    })
    .then(() => res.redirect("/admin/bookings"))
    .catch((err) => {
      console.error(err);
      res.send("Delete booking failed");
    });
});

module.exports = router;
