import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar primary" style={{ opacity:0.4 }}>
      <Link to="/" style={{ color: "black" }}>
        HOME
      </Link>
      <Link to="/FarmerPage" style={{ color: "black" }}>
        FARMER
      </Link>
      <Link to="/OfficialPage" style={{ color: "black" }}>
        GOVERNMENT OFFICIAL
      </Link>
      <Link to="/PolicyMakerPage" style={{ color: "red" }}>
        POLICY MAKER
      </Link>

      <Link to="/login" style={{ color: "red" }}>
        Login
      </Link>
    </div>
  );
};

export default NavBar;
