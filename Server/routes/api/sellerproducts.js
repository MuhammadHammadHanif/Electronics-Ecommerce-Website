const express = require("express");
const passport = require("passport");
const bycrypt = require("bcryptjs");

// For image upload
const upload = require("../../config/multer");

// Models
const User = require("../../models/User");
const SellerProduct = require("../../models/SellerProducts");
const Customer = require("../../models/Customer");

// load input validation
const validateSellerProductsInput = require("../../validation/sellerproducts");
const validateChangePasswordInput = require("../../validation/changepassword");
const validateChangeProductStatusInput = require("../../validation/changeproductstatus");

const router = new express.Router();

// @route  GET api/seller/test
// @desc   Test seller route
// @access Public
router.get("/test", (req, res) => res.send({ message: "Seller works" }));

// @route  POST api/seller
// @desc   Add/Edit products
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.array("images", 10),
  (req, res) => {
    const buff = req.files.map(buff => buff.buffer);
    const { errors, isValid } = validateSellerProductsInput(req.body, buff);

    // check role
    const checkRole = req.user.role != "Seller";
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

    // Get values from req.body
    const {
      productname,
      sellername,
      productcode,
      quantity,
      colors,
      sizes,
      categories,
      price,
      discount,
      description,
      weight,
      dimention,
      material
    } = req.body;
    let images = buff;
    // Get fields
    const productFields = {};
    productFields.user = req.user._id;
    productname && (productFields.productname = productname);
    sellername && (productFields.sellername = sellername);
    productcode && (productFields.productcode = productcode);
    quantity && (productFields.quantity = quantity);
    price && (productFields.price = price);
    discount && (productFields.discount = discount);
    description && (productFields.description = description);

    // Images - Split into array
    if (typeof images !== "undefined") {
      productFields.images = images;
    }
    // colors - Split into array
    if (typeof colors !== "undefined") {
      productFields.colors = colors.split(",");
    }
    // categories - Split into array
    if (typeof categories !== "undefined") {
      productFields.categories = categories.split(",");
    }
    // sizes - Split into array
    if (typeof sizes !== "undefined") {
      productFields.sizes = sizes.split(",");
    }
    // Additional Information
    productFields.additionalinformation = {};
    weight && (productFields.additionalinformation.weight = weight);
    dimention && (productFields.additionalinformation.dimention = dimention);
    material && (productFields.additionalinformation.material = material);

    SellerProduct.findOne({ productcode, user: req.user._id })
      .then(product => {
        if (product) {
          SellerProduct.findOneAndUpdate(
            { productcode },
            { $set: productFields },
            { new: true }
          ).then(product => {
            return res.status(200).send(product);
          });
        } else {
          // check if Product Code exists
          SellerProduct.findOne({ productcode }).then(product => {
            if (product) {
              errors.productcode = "This Product code already exists";
              return res.status(400).send(errors);
            }
            // create new product
            new SellerProduct(productFields)
              .save()
              .then(product => res.status(201).send(product));
          });
        }
      })
      .catch(err => console.log(err));
  },
  (error, req, res, next) => {
    const { errors } = validateSellerProductsInput(req.body, req.files);
    errors.images = error.message;
    return res.status(400).send(errors);
  }
);

// @route  GET api/seller
// @desc   Get all products
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Seller";
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
    SellerProduct.find({ user: req.user._id })
      .populate("user", ["name", "avatar"])
      .then(products => {
        if (products.length === 0) {
          errors.products = "There is no products for this Seller";
          return res.status(404).send(errors);
        }
        return res.status(200).send(products);
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  GET api/seller/getallproductstatus
// @desc   Get all purchased products
// @access Private
router.get(
  "/getallproductstatus",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Seller";
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
    SellerProduct.find({ user: req.user._id })
      .then(products => {
        res.send(products);
      })
      .catch(err => {
        errors.products = "There are no products";
        res.status(404).send(errors);
      });
  }
);

// @route  GET api/seller/:p_id
// @desc   Get product
// @access Private
router.get(
  "/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    // check role
    const checkRole = req.user.role != "Seller";
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

    // find by user id and product id
    SellerProduct.findOne({ _id: req.params.p_id, user: req.user._id })
      .populate("user", ["name", "avatar"])
      .then(products => {
        if (!products) {
          errors.products = "There is no product for this Seller";
          return res.status(404).send(errors);
        }
        return res.status(200).send(products);
      })
      .catch(err => res.status(404).send(err));
  }
);

// @route  POST api/seller/changepassword
// @desc   Change password for Seller
// @access Private
router.post(
  "/changepassword",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    // check role
    const checkRole = req.user.role != "Seller";
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

// @route  POST api/seller/changeproductstatus/:user_id/:p_id
// @desc   Change product status
// @access Private
router.post(
  "/changeproductstatus/:user_id/:p_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangeProductStatusInput(req.body);

    // check role
    const checkRole = req.user.role != "Seller";
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

    const { status } = req.body;

    // find seller by producT ID and user ID
    SellerProduct.findOne({
      _id: req.params.p_id,
      user: req.user._id
    })
      .then(product => {
        if (!product) {
          return res.status(400).send("No product");
        }

        // find seller product status and match the ID and update the status
        SellerProduct.findOneAndUpdate(
          { productstatus: { $elemMatch: { user: req.params.user_id } } },
          { $set: { "productstatus.$.status": status } },
          { new: true }
        ).then(product => {
          // find customer product status and match the ID and update the status
          Customer.findOneAndUpdate(
            {
              purchaseproducts: {
                $elemMatch: {
                  user: req.params.user_id,
                  product: req.params.p_id
                }
              }
            },
            { $set: { "purchaseproducts.$.status": status } },
            { new: true }
          ).then(() => res.status(200).send(product));
        });
      })

      .catch(err => {
        errors.product = "No Product found";
        return res.status(404).send(errors);
      });
  }
);

module.exports = router;
