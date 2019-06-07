const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateLoginInput = data => {
  let errors = {};
  let { password, email, role } = data;
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  role = !isEmpty(role) ? role : "";

  //email
  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }
  // password
  if (validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }
  // role
  if (validator.isEmpty(role)) {
    errors.role = "Role field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
