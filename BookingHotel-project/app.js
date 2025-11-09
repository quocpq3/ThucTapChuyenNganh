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
var adminRouter = require("./routes/admin/admin");
var roomAdminRouter = require("./routes/admin/rooms");
var orderAdminRouter = require("./routes/admin/order");
var servicesAdminRouter = require("./routes/admin/services");
var usersAdminRouter = require("./routes/admin/user");


var app = express();

app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "home",
    // layoutsDir: path.join(__dirname, "views", "layouts"),
    // partialsDir: path.join(__dirname, "views", "partials")
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/home", express.static(path.join(__dirname, "public/home")));
app.use("/admin",express.static(path.join(__dirname, "public/admin")));

// routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/booking", bookingRouter);
app.use("/room-detail", roomDetailRouter);
app.use("/admin", adminRouter);
app.use("/admin/rooms", roomAdminRouter);
app.use("/admin/order", orderAdminRouter);
app.use("/admin/services", servicesAdminRouter);
app.use("/admin/user", usersAdminRouter);


// catch 404
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
