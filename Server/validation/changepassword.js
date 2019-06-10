const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateChangePasswordInput = data => {
  let errors = {};
  let { password, email, password2, oldpassword } = data;
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  password2 = !isEmpty(password2) ? password2 : "";
  oldpassword = !isEmpty(oldpassword) ? oldpassword : "";

  //email
  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }
  // old password
  if (validator.isEmpty(oldpassword)) {
    errors.oldpassword = "Old Password field is required";
  }
  // password
  if (validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }
  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be atleast 6 characters";
  }
  // confirm password
  if (validator.isEmpty(password2)) {
    errors.password2 = "Password field is required";
  }
  if (!validator.equals(password, password2)) {
    errors.password2 = "Password must match";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
