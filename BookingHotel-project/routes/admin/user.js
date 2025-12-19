var express = require("express");
var router = express.Router();
const User = require("../../models/User");
router.use((req, res, next) => {
  res.locals.layout = "admin";
  next();
});

router.get("/", function (req, res) {
  User.find({}).then((users) => {
    const data = users.map((type, index) => ({
      ...type.toObject(),
      isAdmin: type.role == "admin",
      isUser: type.role == "user",
      stt: index + 1,
    }));

    res.render("admin/user/user-list", { users: data });
  });
});
router.get("/create", function (req, res) {
  res.render("admin/user/create");
});
router.post("/create", function (req, res) {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  newUser
    .save()
    .then(() => res.redirect("/admin/user"))
    .catch((err) => res.send(err));
});
router.get("/edit/:id", function (req, res) {
  //đánh dấu role đang được chọn

  User.findOne({ _id: req.params.id }).then((user) => {
    res.render("admin/user/edit", {
      title: "Edit User",
      user: user.toObject(),
      isAdmin: user.role === "admin",
      isUser: user.role === "user",
    });
  });
});
router.put("/edit/:id", function (req, res) {
  User.findOne({ _id: req.params.id }).then((user) => {
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.role = req.body.role;
    user.save().then((saveUser) => {
      res.redirect("/admin/user");
    });
  });
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/user");
  } catch (err) {
    console.log(err);
    res.send("Delete failed");
  }
});
module.exports = router;
