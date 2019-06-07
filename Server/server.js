require("./config/db/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const user = require("./routes/api/user");

const app = new express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// routes
app.use("/api/user", user);

// Port to run server on
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("SERVER RUNNING ON PORT " + port));
