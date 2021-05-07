import React, { Component } from "react";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AllColdStorages from "./AllColdStorages";
import Container from "react-bootstrap/Container";

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
        gasPrice: 1,
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
          <Col xs lg="2">
            <div className="Sidebar">
              <ul className="SidebarList">
                <li
                  className="row"
                  id={this.state.viewToShow == 0 ? "active" : ""}
                  onClick={() => {
                    this.setState({ viewToShow: 0 });
                  }}
                >
                  Verify registration details
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
            <Col>
              <Container>
                <Row>
                  <Link className="btn mb-3" to="/ManageContracts">
                    Manage policies
                  </Link>
                </Row>
                <Row className="mt-5">
                  <Link className="btn" to="/AllActions">
                    Verify Registration details
                  </Link>
                </Row>
              </Container>
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
