const mongoose = require("mongoose");

// DB config
const connectionURL = require("../keys/keys").mongoURL;

// connect to mongoose
mongoose
  .connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Mongoose Connected"))
  .catch(err => console.log(err));
