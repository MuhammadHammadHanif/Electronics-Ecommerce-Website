import React, { Component } from "react";

class Login extends Component {
  state = {
    email: "",
    role: "",
    password: "",
    errors: {}
  };
  onChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = e => {
    e.preventDefault();
    const { email, role, password } = this.state;
    const login = { email, role, password };
    console.log(login);
  };
  render() {
    return (
      <div className="container">
        <br />
        <div className="row">
          <div className="col-md-offset-3 col-md-6 col-md-offset-3">
            <h2 className="display-4 text-center">Log In</h2>
            <p className="lead text-center">Sign in to your Electro account</p>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Email Address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
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
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>

              <input type="submit" className="btn btn-success btn-block mt-4" />
            </form>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default Login;
