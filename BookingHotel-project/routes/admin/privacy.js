var express = require("express");
var router = express.Router();
const Privacy = require("../../models/Privacy");

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  Privacy.find({})
    .sort({ number: 1 })
    .then((items) => {
      const data = items.map((p, index) => ({
        ...p.toObject(),
        stt: index + 1,
      }));

      res.render("admin/privacy/privacy-list", {
        privacies: data,
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading privacy policies");
    });
});

router.get("/create", function (req, res) {
  res.render("admin/privacy/create");
});

router.post("/create", function (req, res) {
  const privacy = new Privacy({
    number: Number(req.body.number) || 0,
    title: req.body.title,
    description: req.body.description,
  });

  privacy
    .save()
    .then(() => res.redirect("/admin/privacy"))
    .catch((err) => {
      console.error(err);
      res.send("Create privacy failed");
    });
});

router.get("/edit/:id", function (req, res) {
  Privacy.findById(req.params.id)
    .then((privacy) => {
      if (!privacy) return res.redirect("/admin/privacy");

      res.render("admin/privacy/edit", {
        privacy: privacy.toObject(),
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading edit form");
    });
});

router.put("/edit/:id", function (req, res) {
  Privacy.findById(req.params.id)
    .then((privacy) => {
      if (!privacy) return res.redirect("/admin/privacy");

      privacy.number = Number(req.body.number) || privacy.number;
      privacy.title = req.body.title;
      privacy.description = req.body.description;

      return privacy.save();
    })
    .then(() => res.redirect("/admin/privacy"))
    .catch((err) => {
      console.error(err);
      res.send("Update privacy failed");
    });
});

router.delete("/:id", function (req, res) {
  Privacy.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/admin/privacy"))
    .catch((err) => {
      console.error(err);
      res.send("Delete privacy failed");
    });
});

module.exports = router;
