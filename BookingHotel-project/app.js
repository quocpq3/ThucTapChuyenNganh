var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var createError = require("http-errors");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

//ROUTES
var indexRouter = require("./routes/home");
var loginRouter = require("./routes/home/login");
var registerRouter = require("./routes/home/register");
var bookingRouter = require("./routes/home/booking");
var roomsRouter = require("./routes/home/rooms");
var roomtypeRouter = require("./routes/home/roomtype");
var termRouter = require("./routes/home/term");
var privacyRouter = require("./routes/home/privacy");
var aboutRouter = require("./routes/home/about");
var contactRouter = require("./routes/home/contact");
var reviewsRouter = require("./routes/home/reviews");

var adminRouter = require("./routes/admin/admin");
var roomAdminRouter = require("./routes/admin/rooms");
var bookingAdminRouter = require("./routes/admin/booking");
var usersAdminRouter = require("./routes/admin/user");
var roomtypeAdminRouter = require("./routes/admin/roomtype");
var amenityAdminRouter = require("./routes/admin/amenity");
var endowAdminRouter = require("./routes/admin/endow");
var termAdminRouter = require("./routes/admin/term");
var privacyAdminRouter = require("./routes/admin/privacy");
var aboutAdminRouter = require("./routes/admin/about");
var contactAdminRouter = require("./routes/admin/contact");
var reviewAdminRouter = require("./routes/admin/review");

var authRouter = require("./routes/auth");

var app = express();

//VIEW ENGINE
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "home",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      inc: function (v) {
        return v + 1;
      },
      eq: function (a, b) {
        return String(a) === String(b);
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//MIDDLEWARE
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//GLOBAL VARIABLES
app.use((req, res, next) => {
  res.locals.user = req.user ? req.user.toObject() : null;
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  res.locals.errors = req.flash("errors");
  next();
});

//STATIC FILES
app.use("/home", express.static(path.join(__dirname, "public/home")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

//ROUTES
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/booking", bookingRouter);
app.use("/rooms", roomsRouter);
app.use("/roomtype", roomtypeRouter);
app.use("/terms", termRouter);
app.use("/privacy", privacyRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use("/reviews", reviewsRouter);

app.use("/admin", adminRouter);
app.use("/admin/rooms", roomAdminRouter);
app.use("/admin/bookings", bookingAdminRouter);
app.use("/admin/user", usersAdminRouter);
app.use("/admin/roomtype", roomtypeAdminRouter);
app.use("/admin/amenity", amenityAdminRouter);
app.use("/admin/endow", endowAdminRouter);
app.use("/admin/term", termAdminRouter);
app.use("/admin/privacy", privacyAdminRouter);
app.use("/admin/about", aboutAdminRouter);
app.use("/admin/contact", contactAdminRouter);
app.use("/admin/review", reviewAdminRouter);

app.use("/", authRouter);

//404 HANDLER
app.use(function (req, res, next) {
  next(createError(404));
});

//ERROR HANDLER
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

//DATABASE
mongoose
  .connect("mongodb://127.0.0.1/node")
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB Connected failed:", err);
  });

module.exports = app;
