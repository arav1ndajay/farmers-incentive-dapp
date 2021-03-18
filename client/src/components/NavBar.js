import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar" style={{ backgroundColor: "brown" }}>
      <Link to="/" style={{ color: "white" }}>
        HOME
      </Link>
      <Link to="/FarmerPage" style={{ color: "white" }}>
        FARMER
      </Link>
      <Link to="/OfficialPage" style={{ color: "white" }}>
        GOVERNMENT OFFICIAL
      </Link>
      <Link to="/PolicyMakerPage" style={{ color: "white" }}>
        POLICY MAKER
      </Link>
    </div>
  );
};

export default NavBar;
