import React from "react";
import NavBar from "./NavBar";

const PolicyMakerPage = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="header">POLICY MAKER PAGE</div>
        <h4> </h4>
        <form className="add-form">
          <div className="form-control">
            <label>Policy details (add multiple rows)</label>
            <input type="text" placeholder="Details" />
          </div>
          <input type="submit" value="Create new policy" className="btn" />
        </form>
      </div>
    </div>
  );
};

export default PolicyMakerPage;
