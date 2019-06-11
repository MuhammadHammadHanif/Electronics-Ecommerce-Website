import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./components/layout/LandingPage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Header />
          <Navbar />
          <Route path="/" exact component={LandingPage} />
          <div>
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
