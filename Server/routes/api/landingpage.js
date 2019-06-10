const express = require("express");
const isEmpty = require("../../validation/isEmpty");

//  models
const SellerProduct = require("../../models/SellerProducts");
const Customer = require("../../models/Customer");

const router = new express.Router();

// @route  GET api/landingpage/test
// @desc   Test Landing Page route
// @access Public
router.get("/test", (req, res) => res.send({ message: "Landing Page works" }));

// @route  POST api/landingpage/search
// @desc   Search for products
// @access Public
router.post("/search", (req, res) => {
  let errors = {};

  const { search } = req.body;
  if (isEmpty(search)) {
    errors.search = "Search field is empty";
    return res.status(400).send(errors);
  }

  SellerProduct.find(
    {
      productname: {
        $regex: new RegExp("^" + search.toLowerCase(), "i")
      }
    },
    {
      _id: 0,
      __v: 0
    }
  )
    .limit(10)
    .then(product => {
      if (!product) {
        errors.search = "No products found";
        return res.status(404).send(errors);
      }
      return res.status(200).send(product);
    })
    .catch(err => console.log(err));
});

// @route  GET api/landingpage/allcategories
// @desc   allcategories
// @access Public
router.get("/allcategories", (req, res) => {
  let errors = {};

  SellerProduct.find({})
    .select("categories")
    .then(product => {
      if (!product) {
        errors.categories = "No Categories";
        return res.status(404).send(errors);
      }
      let objectofarrays = Object.values(product).map(data => data.categories);
      let array = [].concat.apply([], objectofarrays);
      return res.status(200).send([...new Set(array)]);
    })
    .catch(() => {
      errors.categories = "No Categories";
      return res.status(404).send(errors);
    });
});

// @route  GET api/landingpage/recentpurchasedproducts
// @desc   Get all recent purchased products
// @access Public
router.get("/recentpurchasedproducts", (req, res) => {
  const errors = {};

  // all purchased
  Customer.find({})
    .select("purchaseproducts")
    .populate("purchaseproducts.product")
    .limit(10)
    .then(products => {
      if (!products) {
        errors.category = "No purchased products";
        return res.status(400).send(errors);
      }
      res.send(products);
    })
    .catch(err => {
      errors.products = "There are no products";
      res.status(404).send(errors);
    });
});

// @route  POST api/landingpage/allproductsbycategory
// @desc   Get all products by category
// @access Public
router.post("/allproductscategorywise", (req, res) => {
  const errors = {};

  const { category } = req.body;
  if (isEmpty(category)) {
    errors.category = "Select a category";
    return res.status(400).send(errors);
  }

  // all purchased
  SellerProduct.find({ categories: category })
    .limit(10)
    .then(products => {
      if (!products) {
        errors.category = "This category doesn't exists";
        return res.status(400).send(errors);
      }
      if (products.length === 0) {
        errors.category = "This category doesn't exists";
        return res.status(400).send(errors);
      }
      return res.send(products);
    })
    .catch(err => {
      errors.category = "No Category";
      return res.status(400).send(errors);
    });
});

// @route  GET api/landingpage/newarrival
// @desc   Get all new arrival products
// @access Public
router.get("/newarrival", (req, res) => {
  const errors = {};

  // new arrival by date
  SellerProduct.find({})
    .select("images productname _id price discount")
    .sort({ date: -1 })
    .limit(10)
    .then(products => {
      if (!products) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      if (products.length === 0) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      return res.send(products);
    })
    .catch(err => {
      errors.product = "No products";
      return res.status(400).send(errors);
    });
});

// @route  GET api/landingpage/allproducts
// @desc   Get all products
// @access Public
router.get("/allproducts", (req, res) => {
  const errors = {};

  // new arrival by date
  SellerProduct.find({})
    .select("images productname _id price discount")
    .limit(10)
    .then(products => {
      if (!products) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      if (products.length === 0) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      return res.send(products);
    })
    .catch(err => {
      errors.product = "No products";
      return res.status(400).send(errors);
    });
});

// @route  GET api/landingpage/product/:p_id
// @desc   Get all products
// @access Public
router.get("/product/:p_id", (req, res) => {
  const errors = {};

  // new arrival by date
  SellerProduct.findOne({ _id: req.params.p_id })
    .then(products => {
      if (!products) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      if (products.length === 0) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      return res.send(products);
    })
    .catch(err => {
      errors.product = "No products";
      return res.status(400).send(errors);
    });
});

// @route  GET api/landingpage/onsaleproduct
// @desc   Get all sale products
// @access Public
router.get("/onsaleproduct", (req, res) => {
  const errors = {};

  // product on sale
  SellerProduct.find({ discount: { $exists: true } })
    .select("images productname _id price discount")
    .limit(10)
    .then(products => {
      if (!products) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      if (products.length === 0) {
        errors.product = "No products";
        return res.status(400).send(errors);
      }
      return res.send(products);
    })
    .catch(err => {
      errors.product = "No products";
      return res.status(400).send(errors);
    });
});

module.exports = router;
