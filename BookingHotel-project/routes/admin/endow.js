var express = require("express");
var router = express.Router();
const Endow = require("../../models/Endow");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  Endow.find({})
    .then((endows) => {
      const data = endows.map((endow, index) => {
        const obj = endow.toObject();

        return {
          ...obj,
          stt: index + 1,
          isPercent: endow.type === "percent",
          isAmount: endow.type === "amount",
          isCombo: endow.type === "combo",
        };
      });

      res.render("admin/endow/endow-list", { endows: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading endows");
    });
});

router.get("/create", function (req, res) {
  res.render("admin/endow/create");
});
router.post("/create", function (req, res) {
  const newEndow = new Endow({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    value: req.body.type === "combo" ? 0 : Number(req.body.value) || 0,
    status: req.body.status === "true",
    amenity: req.body.amenity,
  });
  newEndow
    .save()
    .then(() => res.redirect("/admin/endow"))
    .catch((err) => res.send(err));
});
router.get("/edit/:id", function (req, res) {
  Endow.findOne({ _id: req.params.id }).then((endow) => {
    isPercent: endow.type === "percent";
    isAmount: endow.type === "amount";
    isCombo: endow.type === "combo";
    res.render("admin/endow/edit", {
      title: "Edit Endow",
      endow: endow.toObject(),
    });
  });
});
router.put("/edit/:id", function (req, res) {
  Endow.findOne({ _id: req.params.id }).then((endow) => {
    endow.name = req.body.name;
    endow.description = req.body.description;
    endow.type = req.body.type;
    endow.value = req.body.type === "combo" ? 0 : Number(req.body.value) || 0;
    endow.status = req.body.status === "true";
    endow.amenity = req.body.amenity;
    endow.save().then((saveEndow) => {
      res.redirect("/admin/endow");
    });
  });
});
router.delete("/:id", async (req, res) => {
  try {
    await Endow.findByIdAndDelete(req.params.id);
    res.redirect("/admin/endow");
  } catch (err) {
    console.log(err);
    res.send("Delete failed");
  }
});

module.exports = router;
