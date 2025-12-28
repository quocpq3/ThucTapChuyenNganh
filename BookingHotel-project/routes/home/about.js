var express = require("express");
var router = express.Router();
const About = require("../../models/About");

/* GET about page (load from DB if available) */
router.get("/", function (req, res) {
  About.find({})
    .sort({ number: 1 })
    .lean()
    .then((abouts) => {
      res.render("home/about", {
        title: "Về chúng tôi",
        abouts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("home/about", { title: "Về chúng tôi", abouts: [] });
    });
});

module.exports = router;
