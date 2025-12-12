var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
var createError = require("http-errors");

var indexRouter = require("./routes/home");
var loginRouter = require("./routes/home/login");
var registerRouter = require("./routes/home/register");
var bookingRouter = require("./routes/home/booking");
var roomDetailRouter = require("./routes/home/roomDetail");
var testRouter = require("./routes/home/test");

var adminRouter = require("./routes/admin/admin");
var roomAdminRouter = require("./routes/admin/rooms");
var orderAdminRouter = require("./routes/admin/order");
var servicesAdminRouter = require("./routes/admin/services");
var usersAdminRouter = require("./routes/admin/user");
var roomDetailAdminRouter = require("./routes/admin/room-detail");

var authRouter = require("./routes/auth");

var app = express();

// Cấu hình Handlebars chuẩn
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "home",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user ? req.user.toObject() : null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error"); // Passport.js often uses 'error'
  res.locals.errors = req.flash("errors");
  next();
});

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
// app.disable("view cache");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use("/home", express.static(path.join(__dirname, "public/home")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

// Routes

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/booking", bookingRouter);
app.use("/room-detail", roomDetailRouter);
app.use("/test", testRouter);

app.use("/admin", adminRouter);
app.use("/admin/rooms", roomAdminRouter);
app.use("/admin/order", orderAdminRouter);
app.use("/admin/services", servicesAdminRouter);
app.use("/admin/user", usersAdminRouter);
app.use("/admin/room-detail", roomDetailAdminRouter);

app.use("/", authRouter);

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

//database connect
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { Stragegy: LocalStrategy } = require("passport-local");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://127.0.0.1/node")
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB Connected failed: " + err);
  });

//api
// const User = require("./models/User");
// const bcryptjs = require("bcryptjs");
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing email or password" });
//   }

//   User.findOne({ email })
//     .then((user) => {
//       if (!user)
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid email or password" });
//       bcryptjs.compare(password, user.password, (err, matched) => {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Server error" });
//         if (matched) {
//           return res.json({
//             success: true,
//             user: {
//               id: user._id,
//               email: user.email,
//               role: user.role,
//               name: user.name,
//               phone: user.phone,
//             },
//           });
//         } else {
//           return res
//             .status(401)
//             .json({ success: false, message: "Invalid email or password" });
//         }
//       });
//     })
//     .catch((err) =>
//       res
//         .status(500)
//         .json({ success: false, message: "Server error", error: err })
//     );
// });
// app.post("/register", (req, res) => {
//   const { name, email, phone, password } = req.body;
//   if (!name || !email || !password) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing required fields" });
//   }

//   // check existing
//   User.findOne({ email })
//     .then((existing) => {
//       if (existing) {
//         return res
//           .status(409)
//           .json({ success: false, message: "Email already in use" });
//       }

//       const newUser = new User({ name, email, phone, role: "user" });
//       bcryptjs.genSalt(10, function (err, salt) {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Server error" });
//         bcryptjs.hash(password, salt, function (err, hash) {
//           if (err)
//             return res
//               .status(500)
//               .json({ success: false, message: "Server error" });
//           newUser.password = hash;
//           newUser
//             .save()
//             .then((userSave) =>
//               res.status(201).json({
//                 success: true,
//                 message: "User created",
//                 user: {
//                   id: userSave._id,
//                   email: userSave.email,
//                   name: userSave.name,
//                 },
//               })
//             )
//             .catch((err) =>
//               res
//                 .status(500)
//                 .json({ success: false, message: "Database error", error: err })
//             );
//         });
//       });
//     })
//     .catch((err) =>
//       res
//         .status(500)
//         .json({ success: false, message: "Server error", error: err })
//     );
// });

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
