var express = require("express");
var router = express.Router();
const RoomType = require("../../models/RoomType");
const Amenity = require("../../models/Amenity");
const { default: mongoose } = require("mongoose");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  RoomType.find({})
    .populate("amenities")
    .then((roomtypes) => {
      const data = roomtypes.map((type, index) => {
        return {
          ...type.toObject(),
          amenities: type.amenities?.map((a) => ({
            _id: a._id,
            name: a.name,
            status: a.status,
          })),
          stt: index + 1,
        };
      });

      res.render("admin/roomtype/roomtype-list", { roomtypes: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading room types");
    });
});

router.get("/create", async (req, res) => {
  const amenities = await Amenity.find({ status: true }).lean();
  res.render("admin/roomtype/create", { amenities });
});

router.post("/create", function (req, res) {
  const newRoomType = new RoomType({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status === "true",
    basePrice: req.body.basePrice,
    maxGuests: req.body.maxGuests,
    amenities: req.body.amenities || [],
  });
  newRoomType
    .save()
    .then(() => res.redirect("/admin/roomtype"))
    .catch((err) => res.send(err));
});

router.get("/edit/:id", async (req, res) => {
  const roomtype = await RoomType.findById(req.params.id);
  const amenities = await Amenity.find({ status: true });

  if (!roomtype) {
    return res.redirect("/admin/roomtype");
  }

  res.render("admin/roomtype/edit", {
    title: "Edit Room Type",
    roomtype: roomtype.toObject(),
    amenities: amenities.map((a) => ({
      ...a.toObject(),
      checked: roomtype.amenities.some(
        (id) => id.toString() === a._id.toString()
      ),
    })),
  });
});

router.put("/edit/:id", function (req, res) {
  let amenities = req.body.amenities || [];
  if (!Array.isArray(amenities)) {
    amenities = [amenities];
  }
  RoomType.findOne({ _id: req.params.id }).then((roomtype) => {
    roomtype.name = req.body.name;
    roomtype.description = req.body.description;
    roomtype.status = req.body.status === "true";
    roomtype.basePrice = req.body.basePrice;
    roomtype.maxGuests = req.body.maxGuests;
    roomtype.amenities = amenities;
    roomtype.save().then((saveRoomType) => {
      res.redirect("/admin/roomtype");
    });
  });
});
router.delete("/:id", async (req, res) => {
  try {
    await RoomType.findByIdAndDelete(req.params.id);
    res.redirect("/admin/roomtype");
  } catch (err) {
    console.log(err);
    res.send("Delete failed");
  }
});

module.exports = router;
