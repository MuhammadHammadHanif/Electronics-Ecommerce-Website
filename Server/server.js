require("./config/db/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const user = require("./routes/api/user");
const seller = require("./routes/api/sellerproducts");
const admin = require("./routes/api/admin");
const customer = require("./routes/api/customer");
const landingpage = require("./routes/api/landingpage");

const app = new express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// routes
app.use("/api/user", user);
app.use("/api/seller", seller);
app.use("/api/admin", admin);
app.use("/api/customer", customer);
app.use("/api/landingpage", landingpage);

// Port to run server on
const port = process.env.PORT || 5000;

app.listen(port, () => console.log("SERVER RUNNING ON PORT " + port));
