var express = require("express");
var router = express.Router();
const Contact = require("../../models/Contact");

/* GET contact page (load from DB if available) */
router.get("/", function (req, res) {
  Contact.findOne({})
    .lean()
    .then((contact) => {
      res.render("home/contact", {
        title: (contact && contact.title) || "Liên hệ",
        description: (contact && contact.description) || "",
        email: (contact && contact.email) || "",
        phone: (contact && contact.phone) || "",
        address: (contact && contact.address) || "",
        mapEmbed: (contact && contact.mapEmbed) || "",
      });
    })
    .catch((err) => {
      console.error(err);
      res.render("home/contact", {
        title: "Liên hệ",
        description: "",
        email: "",
        phone: "",
        address: "",
        mapEmbed: "",
      });
    });
});

module.exports = router;
