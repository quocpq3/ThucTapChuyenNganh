var express = require("express");
var router = express.Router();
const Term = require("../../models/Term");

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  Term.find({})
    .sort({ number: 1 })
    .then((terms) => {
      const data = terms.map((t, index) => ({
        ...t.toObject(),
        stt: index + 1,
      }));

      res.render("admin/term/term-list", { terms: data });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading terms");
    });
});

router.get("/create", function (req, res) {
  res.render("admin/term/create");
});

router.post("/create", function (req, res) {
  const newTerm = new Term({
    number: Number(req.body.number) || 0,
    title: req.body.title,
    description: req.body.description,
  });

  newTerm
    .save()
    .then(() => res.redirect("/admin/term"))
    .catch((err) => {
      console.error(err);
      res.send("Create failed");
    });
});

router.get("/edit/:id", function (req, res) {
  Term.findOne({ _id: req.params.id })
    .then((term) => {
      res.render("admin/term/edit", {
        term: term.toObject(),
      });
    })
    .catch((err) => {
      console.error(err);
      res.send("Error loading edit form");
    });
});

router.put("/edit/:id", function (req, res) {
  Term.findOne({ _id: req.params.id })
    .then((term) => {
      term.number = Number(req.body.number) || term.number;
      term.title = req.body.title;
      term.description = req.body.description;

      return term.save();
    })
    .then(() => res.redirect("/admin/term"))
    .catch((err) => {
      console.error(err);
      res.send("Update failed");
    });
});

router.delete("/:id", function (req, res) {
  Term.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/admin/term"))
    .catch((err) => {
      console.error(err);
      res.send("Delete failed");
    });
});

module.exports = router;
