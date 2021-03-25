import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import TopCarousel from "./TopCarousel";

class HomePage extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <TopCarousel />
      </div>
    );
  }
}

export default HomePage;
