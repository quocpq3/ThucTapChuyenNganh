var createError = require("http-errors");
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var bookingRouter = require("./routes/booking");
var roomDetailRouter = require("./routes/roomDetail");
var adminRouter = require("./routes/admin");

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
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/booking", bookingRouter);
app.use("/room-detail", roomDetailRouter);
app.use("/admin", adminRouter);

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
