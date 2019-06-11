import React, { Component } from "react";
import axios from "axios";
import classnames from "classnames";

class Register extends Component {
  state = {
    name: "",
    email: "",
    role: "",
    password: "",
    password2: "",
    errors: {}
  };
  onChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = e => {
    e.preventDefault();
    const { name, email, role, password, password2 } = this.state;
    const newUser = { name, email, role, password, password2 };
    axios
      .post("api/user/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }));
  };
  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <br />
        <div className="row">
          <div className="col-md-offset-3 col-md-6 col-md-offset-3">
            <h2 className="display-4 text-center">Sign Up</h2>
            <p className="lead text-center">Create your Electro account</p>
            <form noValidate onSubmit={this.onSubmit}>
              <div
                className={classnames("form-group", {
                  "has-error": errors.name
                })}
              >
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
                {errors.name && <div className="help-block">{errors.name}</div>}
              </div>
              <div
                className={classnames("form-group", {
                  "has-error": errors.email
                })}
              >
                <input
                  type="email"
                  className="is-invalid form-control form-control-lg"
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                {errors.email && (
                  <div className="help-block">{errors.email}</div>
                )}
              </div>
              <div
                className={classnames("form-group", {
                  "has-error": errors.role
                })}
              >
                <select
                  className="form-control form-control-lg"
                  name="role"
                  value={this.state.role}
                  onChange={this.onChange}
                >
                  <option value="0">Select Status</option>
                  <option value="Seller">Seller</option>
                  <option value="Customer">Customer</option>
                </select>
                {errors.role && <div className="help-block">{errors.role}</div>}
              </div>
              <div
                className={classnames("form-group", {
                  "has-error": errors.password
                })}
              >
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                {errors.password && (
                  <div className="help-block">{errors.password}</div>
                )}
              </div>
              <div
                className={classnames("form-group", {
                  "has-error": errors.password2
                })}
              >
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm Password"
                  name="password2"
                  value={this.state.password2}
                  onChange={this.onChange}
                />
                {errors.password2 && (
                  <div className="help-block">{errors.password2}</div>
                )}
              </div>
              <input type="submit" className="btn btn-success btn-block " />
            </form>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default Register;
