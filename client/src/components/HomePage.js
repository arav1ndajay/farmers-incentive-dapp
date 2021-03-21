import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";

class HomePage extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h1 style={{ textAlign: "center" }}>Home page</h1>
        <h1 className="header">
          Welcome to the Incentives DApp (need to rename) V 1.0.0
        </h1>
      </div>
    );
  }
}

export default HomePage;
