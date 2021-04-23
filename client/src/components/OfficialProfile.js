import React, { Component } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AllColdStorages from "./AllColdStorages";
window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

var farmerDetails;

class OfficialProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // FarmerInstance: undefined,
      // ColdStorageInstance: undefined,
      account: null,
      web3: null,
      addressOfFarmer: 0,
      viewDetails: false,
      viewToShow: 0,
      priceToFilter: 0,
      locationToFilter: "",
      capacityToFilter: 0,
    };
  }

  updateAddressOfFarmer = (event) => {
    this.setState({ addressOfFarmer: event.target.value });
  };

  viewFarmerDetails = async (event) => {
    event.preventDefault();
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

  setFarmerAsEligible = async (event) => {
    event.preventDefault();
    await this.props.FarmerInstance.methods
      .setFarmerAsEligible(this.state.addressOfFarmer)
      .send({
        from: this.props.account,
        gas: 1000000,
      });
    window.location.reload();
  };

  updateLocationToFilter = (event) => {
    this.setState({ locationToFilter: event.target.value });
  };

  updatePriceToFilter = (event) => {
    this.setState({ priceToFilter: event.target.value });
  };

  updateCapacityToFilter = (event) => {
    this.setState({ capacityToFilter: event.target.value });
  };

  render() {
    return (
      <div>
        <NavBar />
        <Row style={{ height: "95vh" }}>
          <Col>
            <div className="Sidebar">
              <ul className="SidebarList">
                <li
                  className="row"
                  id={this.state.viewToShow == 0 ? "active" : ""}
                  onClick={() => {
                    this.setState({ viewToShow: 0 });
                  }}
                >
                  Farmer related
                </li>
                <li
                  className="row"
                  id={this.state.viewToShow == 1 ? "active" : ""}
                  onClick={() => {
                    this.setState({ viewToShow: 1 });
                  }}
                >
                  Cold storage related
                </li>
              </ul>
            </div>
          </Col>
          {this.state.viewToShow == 0 && (
            <Col sm style={{ margin: "0px" }}>
              <div className="container">
                <div className="header">Farmer details page</div>
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
            </Col>
          )}
          {this.state.viewToShow == 1 && (
            <Col sm>
              <h1 style={{ fontSize: "30px" }}>All cold storages </h1>
              <AllColdStorages
                coldStorageIDs={this.props.coldStorageIDs}
                coldStorageDetails={this.props.coldStorageDetails}
                instance={this.props.ColdStorageInstance}
                account={this.state.account}
                locationToFilter={this.state.locationToFilter}
                capacityToFilter={this.state.capacityToFilter}
                priceToFilter={this.state.priceToFilter}
              />
            </Col>
          )}
          <Col sm>
            <form className="add-form" style={{ maxWidth: "500px" }}>
              <div className="form-control">
                <label>Filter by price</label>
                <input
                  type="number"
                  placeholder="Enter upper limit on price"
                  value={this.state.priceToFilter}
                  onChange={this.updatePriceToFilter}
                />
              </div>
              <div className="form-control">
                <label>Filter by capacity</label>
                <input
                  type="number"
                  placeholder="Enter required capacity"
                  value={this.state.capacityToFilter}
                  onChange={this.updateCapacityToFilter}
                />
              </div>
              <div className="form-control">
                <label>Filter by location</label>
                <input
                  type="text"
                  placeholder="Enter specific location"
                  value={this.state.locationToFilter}
                  onChange={this.updateLocationToFilter}
                />
              </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}
export default OfficialProfile;
