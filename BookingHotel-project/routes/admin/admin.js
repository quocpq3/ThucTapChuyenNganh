
var express = require('express');
var router = express.Router();
router.use((req, res, next) => {
    res.locals.layout = "admin";
    next();
});

router.get("/", function(req, res) {
    res.render("admin/index", {title: "admin"});
})


module.exports = router;