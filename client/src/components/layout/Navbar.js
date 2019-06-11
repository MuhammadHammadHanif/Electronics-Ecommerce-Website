import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav id="navigation">
      {/* <!-- container --> */}
      <div className="container">
        {/* <!-- responsive-nav --> */}
        <div id="responsive-nav">
          {/* <!-- NAV --> */}
          <ul className="main-nav nav navbar-nav">
            <li className="active">
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="#">Hot Deals</a>
            </li>
            <li>
              <a href="#">Categories</a>
            </li>
            <li>
              <a href="#">Laptops</a>
            </li>
            <li>
              <a href="#">Smartphones</a>
            </li>
            <li>
              <a href="#">Cameras</a>
            </li>
            <li>
              <a href="#">Accessories</a>
            </li>
          </ul>
          {/* <!-- /NAV --> */}
        </div>
        {/* <!-- /responsive-nav --> */}
      </div>
      {/* <!-- /container --> */}
    </nav>
  );
};

export default Navbar;
