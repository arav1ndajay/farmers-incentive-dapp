import React from "react";
import NavBar from "./NavBar";
import "../App.css";

const FarmerPage = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="header">Farmer Details</div>
        <form className="add-form">
          <div className="form-control">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>
          <div className="form-control">
            <label>Land owned</label>
            <input type="text" placeholder="Enter area in acres" />
          </div>
          <div className="form-control">
            <label>Place of residence</label>
            <input type="text" placeholder="Enter village/town name" />
          </div>
          <input type="submit" value="Submit Details" className="btn" />
        </form>
      </div>
    </div>
  );
};

export default FarmerPage;
