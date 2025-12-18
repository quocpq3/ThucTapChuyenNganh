var express = require("express");
var router = express.Router();
const Amenity = require("../../models/Amenity");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  Amenity.find({})
    .then((amenities) => {
      const data = amenities.map((type, index) => ({
        ...type.toObject(),
        stt: index + 1,
      }));

      res.render("admin/amenity/amenity-list", { amenities: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading amenitys");
    });
});
router.get("/create", function (req, res) {
  res.render("admin/amenity/create");
});
router.post("/create", function (req, res) {
  const newAmenity = new Amenity({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status === "true",
  });
  newAmenity
    .save()
    .then(() => res.redirect("/admin/amenity"))
    .catch((err) => res.send(err));
});
router.get("/edit/:id", function (req, res) {
  Amenity.findOne({ _id: req.params.id }).then((amenity) => {
    res.render("admin/amenity/edit", {
      title: "Edit Amenity",
      amenity: amenity.toObject(),
    });
  });
});
router.put("/edit/:id", function (req, res) {
  Amenity.findOne({ _id: req.params.id }).then((amenity) => {
    amenity.name = req.body.name;
    amenity.description = req.body.description;
    amenity.status = req.body.status === "true";
    amenity.save().then((saveAmenity) => {
      res.redirect("/admin/amenity");
    });
  });
});
router.delete("/:id", async (req, res) => {
  try {
    await Amenity.findByIdAndDelete(req.params.id);
    res.redirect("/admin/amenity");
  } catch (err) {
    console.log(err);
    res.send("Delete failed");
  }
});

module.exports = router;
