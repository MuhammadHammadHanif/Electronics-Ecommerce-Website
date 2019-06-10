const express = require("express");
const bycrypt = require("bcryptjs");
const passport = require("passport");

const isEmpty = require("../../validation/isEmpty");

// User model
const User = require("../../models/User");
const SellerProduct = require("../../models/SellerProducts");
const Customer = require("../../models/Customer");

// load input validation
const validateChangePasswordInput = require("../../validation/changepassword");
const validateCustomerReviewInput = require("../../validation/review");

const router = new express.Router();

// @route  GET api/customer/test
// @desc   Test customer route
// @access Public
router.get("/test", (req, res) => res.send({ message: "Customer works" }));

// @route  POST api/customer/changepassword
// @desc   Change password for customer
// @access Private
router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // check validation
    if (!isValid) {
      return res.status(400).send(errors);
    }

    const { email, password, oldpassword } = req.body;

    User.findOne({ email })
      .then(user => {
        // check if user is empty
        if (!user) {
          errors.email = "Email Doesn't Exists";
          return res.status(400).send(errors);
        }
        // checking old password
        bycrypt.compare(oldpassword, user.password).then(isMatch => {
          // user found
          if (!isMatch) {
            errors.oldpassword = "Incorrect Password";
            return res.status(400).send(errors);
          }
        });
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

// @route  POST api/customer/review/:p_id
// @desc   Add review to product
// @access Private
router.post(
  "/review/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCustomerReviewInput(req.body);

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // check validations
    if (!isValid) {
      return res.status(400).send(errors);
    }
    SellerProduct.findById(req.params.p_id)
      .then(product => {
        const { text } = req.body;
        const newReview = {
          text,
          name: req.user.name,
          email: req.user.email,
          user: req.user._id
        };

        // Add to reviews array
        product.reviews.unshift(newReview);
        // save
        product.save().then(product =>
          res.send({
            product_id: product._id,
            reviews: product.reviews
          })
        );
      })
      .catch(err =>
        res.status(404).send({ noproductfound: "No product found" })
      );
  }
);

// @route  POST api/customer/like/:p_id
// @desc   Like product
// @access Private
router.post(
  "/like/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // check role
    const checkRole = req.user.role !== "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    SellerProduct.findById(req.params.p_id)
      .then(() => {
        Customer.findOne({ user: req.user._id }).then(customer => {
          let checkProductLiked =
            customer.likedproducts.filter(
              like => like.product.toString() === req.params.p_id.toString()
            ).length > 0;
          if (checkProductLiked) {
            errors.like = "You have already liked this product";
            return res.status(400).send(errors);
          }

          // Add user ID and product ID to like array
          customer.likedproducts.unshift({
            user: req.user._id,
            product: req.params.p_id
          });

          customer.save().then(customer =>
            res.send({
              user: customer.user,
              likedproducts: customer.likedproducts
            })
          );
        });
      })
      .catch(err => {
        errors.noproductfound = "No product found";
        return res.status(404).send(errors);
      });
  }
);

// @route  POST api/customer/unlike/:p_id
// @desc   Unlike product
// @access Private
router.post(
  "/unlike/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};

    // check role
    const checkRole = req.user.role !== "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    SellerProduct.findById(req.params.p_id)
      .then(() => {
        Customer.findOne({ user: req.user._id }).then(customer => {
          let checkProductLiked =
            customer.likedproducts.filter(
              like => like.product.toString() === req.params.p_id.toString()
            ).length === 0;
          if (checkProductLiked) {
            errors.like = "You have not yet liked this post";
            return res.status(400).send(errors);
          }

          // Get remove index
          const removeindex = customer.likedproducts
            .map(item => item.product.toString())
            .indexOf(req.params.p_id);

          // Splice out of array
          customer.likedproducts.splice(removeindex, 1);

          // save
          customer.save().then(customer =>
            res.send({
              user: customer.user,
              likedproducts: customer.likedproducts
            })
          );
        });
      })
      .catch(err => {
        errors.noproductfound = "No product found";
        return res.status(404).send(errors);
      });
  }
);

// @route  GET api/customer/alllikedproducts
// @desc   Get all  liked products
// @access Private
router.get(
  "/alllikedproducts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // find by user id
    Customer.findOne({ user: req.user._id })
      .then(products => {
        if (!products) {
          errors.like = "There are no Liked products";
          return res.status(404).send(errors);
        }
        if (products.likedproducts.length === 0) {
          errors.like = "There are no Liked products";
          return res.status(404).send(errors);
        }
        return res.status(404).send({
          user: products.user,
          likedproducts: products.likedproducts
        });
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  GET api/customer/allproductpurchases
// @desc   Get all products purchases
// @access Private
router.get(
  "/allproductpurchases",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // find by user id
    Customer.findOne({ user: req.user._id })
      .then(customer => {
        let checkProductPurchases =
          customer.purchaseproducts.filter(
            like => like.user.toString() === req.user._id.toString()
          ).length == 0;
        if (checkProductPurchases) {
          errors.product = "There are no products purchases";
          return res.status(400).send(errors);
        }
        return res.status(200).send({
          user: customer.user,
          productpurchases: customer.purchaseproducts
        });
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  POST api/customer/purchaseproduct/:p_id
// @desc   product purchase
// @access Private
router.post(
  "/purchaseproduct/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // find by user id
    SellerProduct.findById(req.params.p_id)
      .then(product => {
        if (!product) {
          errors.product = "There is no product";
          return res.status(400).send(errors);
        }
        // Add user ID  to status array od Seller
        product.productstatus.unshift({
          user: req.user._id
        });
        product
          .save()
          .then(() => {
            Customer.findOne({ user: req.user._id }).then(customer => {
              // Add product ID  to Pruchase Product array of Customer
              customer.purchaseproducts.unshift({
                product: req.params.p_id,
                user: req.user._id
              });
              customer.save().then(product =>
                res.status(200).send({
                  user: product.user,
                  purchase: product.purchaseproducts
                })
              );
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  GET api/customer/productstatus
// @desc   Get all products status
// @access Private
router.get(
  "/productstatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Customer";
    if (checkRole) {
      errors.email = "You are not authorized";
      return res.status(400).send(errors);
    }

    // check status
    const checkStatus = req.user.status === "Block";
    if (checkStatus) {
      errors.email = "User is Blocked by admin";
      return res.status(400).send(errors);
    }

    // find by user id
    Customer.findOne({ user: req.user._id })
      .then(customer => {
        if (!customer) {
          errors.product = "There are no purchased products for status";
          return res.status(400).send(errors);
        }
        if (customer.purchaseproducts.length === 0) {
          errors.like = "There are no purchased products for status";
          return res.status(404).send(errors);
        }
        return res.status(200).send({
          user: req.user._id,
          productstatus: customer.purchaseproducts
        });
      })
      .catch(err => res.status(404).send(err));
  }
);

module.exports = router;
