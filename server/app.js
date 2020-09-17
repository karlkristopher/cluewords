const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const passportStrategy = require("./config/passport");
const config = require("./config");

const indexRouter = require("./routes/index");
const gameRouter = require("./routes/game");
const authRouter = require("./routes/auth");

// app configuration
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());
app.use(logger("dev"));
app.use(passport.initialize());
passport.use(passportStrategy);

// database connection using Mongoose
mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.log(err));

// setup routes
app.use("/", indexRouter);
app.use("/users", authRouter);
app.use(gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
