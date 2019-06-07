const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateSellerProductsInput = (data, file) => {
  let errors = {};
  let {
    productname,
    sellername,
    productcode,
    quantity,
    colors,
    sizes,
    categories,
    price,
    description
  } = data;
  let images = file.toString();
  productname = !isEmpty(productname) ? productname : "";
  sellername = !isEmpty(sellername) ? sellername : "";
  quantity = !isEmpty(quantity) ? quantity : "";
  images = !isEmpty(images) ? images : "";
  colors = !isEmpty(colors) ? colors : "";
  sizes = !isEmpty(sizes) ? sizes : "";
  categories = !isEmpty(categories) ? categories : "";
  price = !isEmpty(price) ? price : "";
  description = !isEmpty(description) ? description : "";
  productcode = !isEmpty(productcode) ? productcode : "";

  // Product Code
  if (validator.isEmpty(productcode)) {
    errors.productcode = "Product Code Field is required";
  }
  // Description
  if (validator.isEmpty(description)) {
    errors.description = "Description Field is required";
  }
  // Price
  if (validator.isEmpty(price)) {
    errors.price = "Price Field is required";
  }
  // Category
  if (validator.isEmpty(categories)) {
    errors.categories = "Category Field is required";
  }
  // Sizes
  if (validator.isEmpty(sizes)) {
    errors.sizes = "Sizes Field is required";
  }
  // Product Name
  if (validator.isEmpty(productname)) {
    errors.productname = "Product Name is required";
  }
  // Seller Name
  if (validator.isEmpty(sellername)) {
    errors.sellername = "Seller Name field is required";
  }
  // Quantity
  if (validator.isEmpty(quantity)) {
    errors.quantity = "Quantity field is required";
  }
  // Images
  if (validator.isEmpty(images)) {
    errors.images = "Images field is required";
  }
  // Colors
  if (validator.isEmpty(colors)) {
    errors.colors = "Colors field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
