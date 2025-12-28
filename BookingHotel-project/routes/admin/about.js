var express = require("express");
var router = express.Router();
const About = require("../../models/About");

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  About.find({})
    .sort({ number: 1 })
    .then((items) => {
      const data = items.map((p, index) => ({
        ...p.toObject(),
        stt: index + 1,
      }));

      res.render("admin/about/about-list", { abouts: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading about items");
    });
});

router.get("/create", function (req, res) {
  res.render("admin/about/create");
});

router.post("/create", function (req, res) {
  const about = new About({
    number: Number(req.body.number) || 0,
    title: req.body.title,
    description: req.body.description,
  });

  about
    .save()
    .then(() => res.redirect("/admin/about"))
    .catch((err) => {
      console.error(err);
      res.send("Create about failed");
    });
});

router.get("/edit/:id", function (req, res) {
  About.findOne({ _id: req.params.id })
    .then((about) => {
      if (!about) return res.redirect("/admin/about");
      res.render("admin/about/edit", { about: about.toObject() });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading edit form");
    });
});

router.put("/edit/:id", function (req, res) {
  About.findOne({ _id: req.params.id })
    .then((about) => {
      if (!about) return res.redirect("/admin/about");

      about.number = Number(req.body.number) || about.number;
      about.title = req.body.title;
      about.description = req.body.description;

      return about.save();
    })
    .then(() => res.redirect("/admin/about"))
    .catch((err) => {
      console.error(err);
      res.send("Update about failed");
    });
});

router.delete("/:id", function (req, res) {
  About.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/admin/about"))
    .catch((err) => {
      console.error(err);
      res.send("Delete about failed");
    });
});

module.exports = router;
