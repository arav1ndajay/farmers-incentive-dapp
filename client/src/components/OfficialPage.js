import React from "react";
import NavBar from "./NavBar";

const OfficialPage = () => {
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="header">Government Page</div>
        <h4
          style={{
            marginTop: "20px",
            marginBottom: "20px",
            fontSize: "18px",
            marginLeft: "20px",
          }}
        >
          Please verify details of farmer before proceeding
        </h4>
        <form className="add-form">
          <div className="form-control">
            <label>Address of farmer</label>
            <input type="text" placeholder="Enter account address of farmer" />
          </div>
          <input type="submit" value="Set as eligible" className="btn" />
        </form>
      </div>
    </div>
  );
};
export default OfficialPage;
