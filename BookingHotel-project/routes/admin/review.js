var express = require("express");
var router = express.Router();
const Review = require("../../models/Review");

router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

function isLoggedIn(req, res, next) {
  if (!req.user) return res.redirect("/login");
  next();
}

router.get("/", function (req, res) {
  Review.find({})
    .populate("user")
    .sort({ createdAt: -1 })
    .then((reviews) => {
      const data = reviews.map((r, index) => ({
        ...r.toObject(),
        stt: index + 1,
        statusApproved: r.status === "approved",
      }));
      res.render("admin/review/review-list", { reviews: data });
    });
});

router.get("/create", isLoggedIn, function (req, res) {
  res.render("admin/review/create");
});

router.post("/create", isLoggedIn, function (req, res) {
  const review = new Review({
    user: req.user._id,
    rating: Number(req.body.rating),
    comment: req.body.comment,
    status: "approved",
  });

  review.save().then(() => res.redirect("/admin/review"));
});

router.get("/edit/:id", function (req, res) {
  Review.findById(req.params.id)
    .populate("user")
    .then((review) => {
      if (!review) return res.redirect("/admin/review");
      res.render("admin/review/edit", { review: review.toObject() });
    });
});

router.put("/edit/:id", function (req, res) {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review) return res.redirect("/admin/review");
      if (["approved", "rejected"].includes(req.body.status)) {
        review.status = req.body.status;
        return review.save();
      } else {
        return Promise.resolve();
      }
    })
    .then(() => res.redirect("/admin/review"));
});

router.delete("/:id", function (req, res) {
  Review.findByIdAndDelete(req.params.id).then(() =>
    res.redirect("/admin/review")
  );
});

module.exports = router;
