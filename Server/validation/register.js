const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateRegisterInput = data => {
  let errors = {};
  let { name, password, email, password2, role } = data;
  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  password2 = !isEmpty(password2) ? password2 : "";
  role = !isEmpty(role) ? role : "";

  // name
  if (!validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 or 30 characters";
  }
  if (validator.isEmpty(name)) {
    errors.name = "Name field is required";
  }
  //email
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }
  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }
  //role
  if (validator.isEmpty(role)) {
    errors.role = "Role field is required";
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
