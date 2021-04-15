import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import { Row, Col } from "react-bootstrap";
import AvailableStorages from "./AvailableStorages";
import RequestedStorages from "./RequestedStorages";
import ApprovedStorages from "./ApprovedStorages";
import OwnStorages from "./OwnStorages";
import RentedStorages from "./RentedStorages";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

class ColdStoragePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ColdStorageInstance: undefined,
      account: null,
      web3: null,
      ownerName: "",
      location: "",
      capacity: 0,
      coldStorageIDs: [],
      coldStorageDetails: [],
      requestedIDs: [],
      requestedStorages: [],
      approvedIDs: [],
      approvedStorages: [],
      rentedIDs: [],
      rentedStorages: [],
      tenants: [],
      price: 0,
      priceToFilter: 0,
      locationToFilter: "",
      capacityToFilter: 0,
      viewToShow: 0,
    };
  }

  componentDidMount = async () => {
    //Refresh page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ColdStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ColdStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      //getting available cold storages
      var _coldStorageIDs = await instance.methods.getColdStorageIDs().call();

      for (let i = 0; i < _coldStorageIDs.length; i++) {
        let obj = await instance.methods
          .getColdStorage(_coldStorageIDs[i])
          .call();
        this.state.coldStorageDetails.push(obj);
      }

      //getting the requested IDs and storages
      var _requestedIDs = await instance.methods
        .getCSrequested(accounts[0])
        .call();

      for (let i = 0; i < _requestedIDs.length; i++) {
        if (_requestedIDs[i] != 0) {
          let obj = await instance.methods
            .getColdStorage(_requestedIDs[i])
            .call();
          this.state.requestedStorages.push(obj);
        }
      }

      //getting the approved IDs and storages
      var _approvedIDs = await instance.methods
        .getCSapproved(accounts[0])
        .call();

      for (let i = 0; i < _approvedIDs.length; i++) {
        if (_approvedIDs[i] != 0) {
          let obj = await instance.methods
            .getColdStorage(_approvedIDs[i])
            .call();
          this.state.approvedStorages.push(obj);
        }
      }

      //getting the rented IDs and storages
      var _rentedIDs = await instance.methods
        .getRentedStorages(accounts[0])
        .call();

      for (let i = 0; i < _rentedIDs.length; i++) {
        if (_rentedIDs[i] != 0) {
          let obj = await instance.methods.getColdStorage(_rentedIDs[i]).call();
          this.state.rentedStorages.push(obj);
        }
      }

      this.setState({
        ColdStorageInstance: instance,
        web3: web3,
        account: accounts[0],
        coldStorageIDs: _coldStorageIDs,
        requestedIDs: _requestedIDs,
        approvedIDs: _approvedIDs,
        rentedIDs: _rentedIDs,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
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
                  Available Cold Storages
                </li>
                <li
                  className="row"
                  id={this.state.viewToShow == 1 ? "active" : ""}
                  onClick={() => {
                    this.setState({ viewToShow: 1 });
                  }}
                >
                  Requested and Approved Cold Storages
                </li>
                <li
                  className="row"
                  id={this.state.viewToShow == 2 ? "active" : ""}
                  onClick={() => {
                    this.setState({ viewToShow: 2 });
                  }}
                >
                  Your Cold Storages
                </li>
              </ul>
            </div>
          </Col>
          {this.state.viewToShow == 0 && (
            <Col sm style={{ margin: "0px" }}>
              <h1 style={{ fontSize: "30px" }}>Available cold storages </h1>
              <AvailableStorages
                coldStorageIDs={this.state.coldStorageIDs}
                coldStorageDetails={this.state.coldStorageDetails}
                locationToFilter={this.state.locationToFilter}
                priceToFilter={this.state.priceToFilter}
                capacityToFilter={this.state.capacityToFilter}
                instance={this.state.ColdStorageInstance}
                account={this.state.account}
                requestedIDs={this.state.requestedIDs}
                approvedIDs={this.state.approvedIDs}
                rentedIDs={this.state.rentedIDs}
              />
            </Col>
          )}
          {this.state.viewToShow == 1 && (
            <Col sm>
              <h1 style={{ fontSize: "30px" }}>Requested cold storages </h1>
              <RequestedStorages
                requestedIDs={this.state.requestedIDs}
                requestedStorages={this.state.requestedStorages}
                instance={this.state.ColdStorageInstance}
                account={this.state.account}
              />
              <h1 style={{ fontSize: "30px" }}>Approved cold storages </h1>
              <ApprovedStorages
                approvedIDs={this.state.approvedIDs}
                approvedStorages={this.state.approvedStorages}
                instance={this.state.ColdStorageInstance}
                account={this.state.account}
                web3={this.state.web3}
              />
            </Col>
          )}
          {this.state.viewToShow == 2 && (
            <Col sm>
              <h1 style={{ fontSize: "30px" }}>Own storages </h1>
              <OwnStorages
                coldStorageIDs={this.state.coldStorageIDs}
                coldStorageDetails={this.state.coldStorageDetails}
                locationToFilter={this.state.locationToFilter}
                priceToFilter={this.state.priceToFilter}
                capacityToFilter={this.state.capacityToFilter}
                instance={this.state.ColdStorageInstance}
                account={this.state.account}
              />
              <h1 style={{ fontSize: "30px" }}>Rented storages </h1>
              <RentedStorages
                rentedIDs={this.state.rentedIDs}
                rentedStorages={this.state.rentedStorages}
                instance={this.state.ColdStorageInstance}
                account={this.state.account}
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

export default ColdStoragePage;
