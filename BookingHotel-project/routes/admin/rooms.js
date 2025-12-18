var express = require("express");
var router = express.Router();
const Rooms = require("../../models/Rooms");
const RoomType = require("../../models/RoomType");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  Rooms.find({})
    .populate("roomType")
    .then((rooms) => {
      const data = rooms.map((type, index) => {
        return {
          ...type.toObject(),
          roomTypeName: type.roomType?.name || "No type",
          isAvailable: type.status === "Available",
          isOccupied: type.status === "Occupied",
          isMaintenance: type.status === "Maintenance",
          stt: index + 1,
        };
      });

      res.render("admin/rooms/rooms-list", { rooms: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading rooms-list");
    });
});
router.get("/create", async (req, res) => {
  const roomtypes = await RoomType.find({ status: true }).lean();
  res.render("admin/rooms/create", { roomtypes });
});
router.post("/create", function (req, res) {
  console.log("POST data:", req.body);
  const newRoom = new Rooms({
    roomNumber: req.body.roomNumber,
    roomType: req.body.roomType,
    floor: req.body.floor,
    image: req.body.image || "",
    status: req.body.status || "Available",
    notes: req.body.notes || "",
  });
  newRoom
    .save()
    .then(() => res.redirect("/admin/rooms"))
    .catch((err) => res.send(err));
});
router.get("/edit/:id", async (req, res) => {
  const room = await Rooms.findById(req.params.id).lean();
  const roomtypes = await RoomType.find({ status: true }).lean();

  res.render("admin/rooms/edit", {
    room,
    roomtypes,
    room: {
      ...room,
      isAvailable: room.status === "Available",
      isOccupied: room.status === "Occupied",
      isMaintenance: room.status === "Maintenance",
    },
  });
});

router.put("/edit/:id", function (req, res) {
  Rooms.findOne({ _id: req.params.id }).then((room) => {
    room.roomNumber = req.body.roomNumber;
    room.roomType = req.body.roomType;
    room.floor = req.body.floor;
    room.image = req.body.image || room.image;
    room.status = req.body.status;
    room.notes = req.body.notes;
    room.save().then((saveRoom) => {
      res.redirect("/admin/rooms");
    });
  });
});

router.delete("/:id", async (req, res) => {
  try {
    await Rooms.findByIdAndDelete(req.params.id);
    res.redirect("/admin/rooms");
  } catch (err) {
    console.log(err);
    res.send("Delete failed");
  }
});
module.exports = router;
