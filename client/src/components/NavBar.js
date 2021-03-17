import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar">
      <Link to="/">HOME</Link>
      <Link to="/FarmerPage">FARMER</Link>
      <Link to="/OfficialPage">GOVERNMENT OFFICIAL</Link>
      <Link to="/PolicyMakerPage">POLICY MAKER</Link>
    </div>
  );
};

export default NavBar;
