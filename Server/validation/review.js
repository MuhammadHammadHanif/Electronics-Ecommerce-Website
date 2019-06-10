const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateCustomerReviewInput = data => {
  let errors = {};
  let { text } = data;
  text = !isEmpty(text) ? text : "";

  // text
  if (!validator.isLength(text, { min: 10, max: 300 })) {
    errors.text = "Review must be between 10 and 300 charaters";
  }
  if (validator.isEmpty(text)) {
    errors.text = "Review field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
