const express = require("express");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const gravatar = require("gravatar");

// User model
const User = require("../../models/User");

// load input validation
const validateChangePasswordInput = require("../../validation/changepassword");

const router = new express.Router();

// @route  GET api/admin/test
// @desc   Test admin route
// @access Public
router.get("/test", (req, res) => res.send({ message: "Admin works" }));

// @route  POST api/admin/changepassword
// @desc   Change password for Admin
// @access Private
router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    // check role
    const checkRole = req.user.role != "Admin";
    if (checkRole) {
      errors.email = "You are not authorized to change password";
      return res.status(400).send(errors);
    }

    // check validation
    if (!isValid) {
      return res.status(400).send(errors);
    }

    const { email, password } = req.body;

    User.findOne({ email })
      .then(user => {
        // check if user is empty
        if (!user) {
          errors.email = "Email Doesn't Exists";
          return res.status(400).send(errors);
        }
        user.password = password;
        bycrypt.genSalt(10, (err, salt) => {
          bycrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            user.password = hash;
            // Save
            user
              .save()
              .then(user => res.send(user))
              .catch(err => console.log(err));
          });
        });
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  POST api/admin/userstatus
// @desc   Change Status for Users
// @access Private
router.post(
  "/userstatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // check role
    const checkRole = req.user.role != "Admin";
    if (checkRole) {
      errors.email = "You are not authorized to change Status";
      return res.status(400).send(errors);
    }

    const { email, status } = req.body;

    User.findOne({ email })
      .then(user => {
        // check if user is empty
        if (!user) {
          errors.email = "Email Doesn't Exists";
          return res.status(400).send(errors);
        }
        user.status = status;
        // Save
        user
          .save()
          .then(user => res.send(user))
          .catch(err => console.log(err));
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  GET api/admin
// @desc   Get all Users
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Admin";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }
    // find by user id
    User.find({})
      .then(user => {
        if (user.length === 0) {
          errors.users = "There are no users";
          return res.status(404).send(errors);
        }
        return res.status(200).send(user);
      })
      .catch(err => res.status(404).send(err));
  }
);

module.exports = router;
