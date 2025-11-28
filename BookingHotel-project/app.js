require("dotenv").config();
console.log("JWT_SECRET = ", process.env.JWT_SECRET);

var createError = require("http-errors");
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/home");
var loginRouter = require("./routes/home/login");
var bookingRouter = require("./routes/home/booking");
var roomDetailRouter = require("./routes/home/roomDetail");
var testRouter = require("./routes/home/test");
var authApiRouter = require("./routes/auth");

var adminRouter = require("./routes/admin/admin");
var roomAdminRouter = require("./routes/admin/rooms");
var orderAdminRouter = require("./routes/admin/order");
var servicesAdminRouter = require("./routes/admin/services");
var usersAdminRouter = require("./routes/admin/user");
var roomDetailAdminRouter = require("./routes/admin/room-detail");
var authMiddleware = require("./middleware/auth");
var isAdmin = require("./middleware/isAdmin");

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

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.disable("view cache");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files
app.use("/home", express.static(path.join(__dirname, "public/home")));
app.use("/admin", express.static(path.join(__dirname, "public/admin")));

// Routes home
app.use("/", indexRouter);
app.use("/booking", bookingRouter);
app.use("/room-detail", roomDetailRouter);
app.use("/test", testRouter);

//Route auth login
app.use("/login", loginRouter);

//Routes admin
app.use("/admin", authMiddleware, isAdmin, adminRouter);
app.use("/admin/rooms", authMiddleware, isAdmin, roomAdminRouter);
app.use("/admin/order", authMiddleware, isAdmin, orderAdminRouter);
app.use("/admin/services", authMiddleware, isAdmin, servicesAdminRouter);
app.use("/admin/user", authMiddleware, isAdmin, usersAdminRouter);
app.use("/admin/room-detail", authMiddleware, isAdmin, roomDetailAdminRouter);

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose
  .connect("mongodb://127.0.0.1/node")
  .then(() => {
    console.log("MongoDB Connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB Connected failed:" + err);
  });

// Auth API routes
app.use("/auth", authApiRouter);

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
