var express = require("express");
var router = express.Router();
const RoomType = require("../../models/RoomType");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  RoomType.find({})
    .then((roomtypes) => {
      const data = roomtypes.map((type, index) => ({
        ...type.toObject(),
        stt: index + 1,
      }));

      res.render("admin/roomtype/roomtype-list", { roomtypes: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading room types");
    });
});
router.get("/create", function (req, res) {
  res.render("admin/roomtype/create");
});
router.post("/create", function (req, res) {
  const newRoomType = new RoomType({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status === "true",
  });
  newRoomType
    .save()
    .then(() => res.redirect("/admin/roomtype"))
    .catch((err) => res.send(err));
});
router.get("/edit/:id", function (req, res) {
  RoomType.findOne({ _id: req.params.id }).then((roomtype) => {
    res.render("admin/roomtype/edit", {
      title: "Edit Room Type",
      roomtype: roomtype.toObject(),
    });
  });
});
router.put("/edit/:id", function (req, res) {
  RoomType.findOne({ _id: req.params.id }).then((roomtype) => {
    roomtype.name = req.body.name;
    roomtype.description = req.body.description;
    roomtype.status = req.body.status === "true";
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
