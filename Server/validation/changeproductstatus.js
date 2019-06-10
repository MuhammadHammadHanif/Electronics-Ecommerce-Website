const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateChangeProductStatusInput = data => {
  let errors = {};
  let { status } = data;
  status = !isEmpty(status) ? status : "";

  // status
  if (validator.isEmpty(status)) {
    errors.status = "Status field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
