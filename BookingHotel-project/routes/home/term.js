var express = require("express");
var router = express.Router();
const Term = require("../../models/Term");

router.get("/", function (req, res) {
  Term.find({})
    .sort({ number: 1 }) // sắp xếp đúng thứ tự điều khoản
    .lean()
    .then((clauses) => {
      res.render("home/terms", {
        title: "Điều khoản",
        clauses,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Lỗi khi tải trang Điều khoản");
    });
});

module.exports = router;
