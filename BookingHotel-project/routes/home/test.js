var express = require("express");
var router = express.Router();

/* GET login page. */
router.get("/", function (req, res, next) {
    res.render("home/test", { title: "test" });
});

module.exports = router;
