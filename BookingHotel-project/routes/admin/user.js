
var express = require('express');
var router = express.Router();
router.use((req, res, next) => {
    res.locals.layout = "admin";
    next();
});

router.get("/", function(req, res) {
    res.render("admin/user", {title: "user"});
})

module.exports = router;