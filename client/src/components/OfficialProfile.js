import React, { Component } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

var farmerDetails;

class OfficialProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FarmerInstance: undefined,
      account: null,
      web3: null,
      addressOfFarmer: 0,
      viewDetails: false,
    };
  }

  updateAddressOfFarmer = (event) => {
    this.setState({ addressOfFarmer: event.target.value });
  };

  viewFarmerDetails = async () => {
    try {
      farmerDetails = await this.props.FarmerInstance.methods
        .getFarmerDetails(this.state.addressOfFarmer)
        .call({ from: this.props.account });

      console.log(farmerDetails);
      this.setState({ viewDetails: true });
    } catch (error) {
      this.setState({ viewDetails: false });
      alert("Invalid address, please try again!");
      console.error(error);
    }
  };

  setFarmerAsEligible = async () => {
    await this.props.FarmerInstance.methods
      .setFarmerAsEligible(this.state.addressOfFarmer)
      .send({
        from: this.props.account,
        gas: 1000000,
      });
    window.location.reload();
  };

  render() {
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
            }}
          >
            Please verify details of farmer before proceeding
          </h4>
          <form className="add-form">
            <div className="form-control">
              <label>Address of farmer</label>
              <input
                type="text"
                value={this.state.addressOfFarmer}
                onChange={this.updateAddressOfFarmer}
                placeholder="Enter address of farmer"
              />
            </div>
            <button
              className="btn"
              style={{ marginBottom: "30px" }}
              onClick={this.viewFarmerDetails}
            >
              View Details
            </button>
            <input
              type="submit"
              value="Set as eligible"
              className="btn"
              onClick={this.setFarmerAsEligible}
            />
          </form>
          {this.state.viewDetails === true && (
            <div>
              <h4 style={{ textAlign: "center" }}>
                Details of farmer {this.state.addressOfFarmer}
              </h4>
              <div style={{ textAlign: "center" }}>
                Name: {farmerDetails._name}
              </div>
              <div style={{ textAlign: "center" }}>
                Gender: {farmerDetails._gender}
              </div>
              <div style={{ textAlign: "center" }}>
                Land Owned: {farmerDetails._landOwned}
              </div>
              <div style={{ textAlign: "center" }}>
                Place of Residence: {farmerDetails._stateOfResidence}
              </div>
              <div style={{ textAlign: "center" }}>
                Is Eligible for Incentive:{" "}
                {farmerDetails._isEligible.toString()}
              </div>
            </div>
          )}
        </div>

        <Link className="btn" to="/ManageContracts">
          Manage policies
        </Link>

      </div>
    );
  }
}
export default OfficialProfile;
