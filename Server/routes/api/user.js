const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");

// User model
const User = require("../../models/User");

// key for JWT token
const key = require("../../config/keys/keys").secretOrKey;

// load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const router = new express.Router();

// @route  GET api/user/test
// @desc   Test users route
// @access Public
router.get("/test", (req, res) => res.send({ message: "Users works" }));

// @route  GET api/user/register
// @desc   Register User route
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).send(errors);
  }
  let { name, email, role, password, avatar } = req.body;
  User.findOne({ email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).send(errors);
    }
    avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });
    const newUser = new User({
      name,
      email,
      role,
      password,
      avatar
    });
    bycrypt.genSalt(10, (err, salt) => {
      bycrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.send(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route  GET api/user/login
// @desc   Login User / Returning JWT Token route
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).send(errors);
  }
  const { email, password, role } = req.body;
  // find by email, password, role
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(400).send(errors);
    }
    if (role !== user.role) {
      errors.role = "Role is incorrect";
      return res.status(400).send(errors);
    }
    // comparing password with Hash password
    bycrypt.compare(password, user.password).then(isMatch => {
      // user found
      if (isMatch) {
        // creating payload for JWT
        const payload = {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          role: user.role
        };
        // sign Token
        jwt.sign(payload, key, (err, token) => {
          res.status(200).send({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).send(errors);
      }
    });
  });
});

// @route  GET api/user/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;
