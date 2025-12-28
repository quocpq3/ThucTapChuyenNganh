var express = require("express");
var router = express.Router();
const Privacy = require("../../models/Privacy");
router.get("/", function (req, res) {
  Privacy.find({})
    .lean()
    .then((clauses) => {
      res.render("home/privacy", {
        title: "Chính sách quyền riêng tư",
        clauses,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Lỗi khi tải trang Quyền riêng tư");
    });
});

module.exports = router;
