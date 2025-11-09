
var express = require('express');
var router = express.Router();
router.all("*", function(req, res, next) {
    res.app.locals.layout= "admin";
    next();
})


router.get("/", function(req, res) {
    res.render("admin/services", {title: "services"});
})

module.exports = router;