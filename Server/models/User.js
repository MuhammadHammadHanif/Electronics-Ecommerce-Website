const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  status: {
    type: String,
    default: "Active"
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = User = mongoose.model("users", UserSchema);
