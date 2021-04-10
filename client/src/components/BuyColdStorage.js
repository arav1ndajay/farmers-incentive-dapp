import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import { Card, Container, Row, Col, Button } from "react-bootstrap";

class AvailableStorages extends React.Component {
  render() {
    var coldStorageIDs = this.props.coldStorageIDs;
    var coldStorageDetails = this.props.coldStorageDetails;
    var instance = this.props.instance;
    var account = this.props.account;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

    var coldStorageList = coldStorageIDs.map(function (ID, index) {
      if (
        (coldStorageDetails[index]._location
          .toLowerCase()
          .includes(locationToFilter) ||
          locationToFilter === "") &&
        (priceToFilter == 0 ||
          parseInt(coldStorageDetails[index]._price) / 10 ** 18 <=
            priceToFilter) &&
        (capacityToFilter === 0 ||
          parseInt(coldStorageDetails[index]._capacity) >= capacityToFilter)
      ) {
        return (
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {coldStorageDetails[index]._ownerAddress}
            </h2>
            <ul>
              <li>Owner name: {coldStorageDetails[index]._ownerName}</li>
              <li>Location: {coldStorageDetails[index]._location}</li>
              <li>Capacity: {coldStorageDetails[index]._capacity}</li>
              <li>
                Price: {coldStorageDetails[index]._price / 10 ** 18} ether
              </li>
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      console.log(typeof account);
                      await instance.methods.requestColdStorage(ID).send({
                        from: account,
                        gas: 1000000,
                      });
                      alert("Request has been placed!");
                      window.location.reload();
                    } catch (error) {
                      alert("Something went wrong. Please try again!");
                      console.log(error);
                    }
                  }}
                >
                  Request cold storage
                </button>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                  onClick={async () => {
                    try {
                      console.log(account);
                      console.log(ID);
                      var x = await instance.methods
                        .getRequests(ID)
                        .call({ from: account });
                      console.log(x);
                    } catch (error) {
                      alert("You are not the owner!");
                      console.log(error);
                    }
                  }}
                >
                  Show Requests
                </button>
              </Row>
            </ul>
          </Card>
        );
      } else return <div></div>;
    });

    return <ul>{coldStorageList}</ul>;
  }
}

class RequestedStorages extends React.Component {
  render() {
    var requestedIDs = this.props.requestedIDs;
    var requestedStorages = this.props.requestedStorages;
    var instance = this.props.instance;
    var account = this.props.account;

    console.log(requestedIDs);

    var requestedStorageList = requestedIDs.map(function (ID, index) {
      if (requestedStorages[index] != null) {
        return (
          <Card key={index} style={{ marginBottom: "10px", maxWidth: "300px" }}>
            <h2>ID: {ID}</h2>
            <h2 style={{ fontSize: "20px" }}>
              Owner's address: {requestedStorages[index]._ownerAddress}
            </h2>
            <ul>
              <li>Owner name: {requestedStorages[index]._ownerName}</li>
              <li>Location: {requestedStorages[index]._location}</li>
              <li>Capacity: {requestedStorages[index]._capacity}</li>
              <li>Price: {requestedStorages[index]._price / 10 ** 18} ether</li>
              <Row>
                <button
                  style={{
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "red",
                  }}
                >
                  View status
                </button>
              </Row>
            </ul>
          </Card>
        );
      }
    });

    if (requestedStorageList != null) {
      return <ul>{requestedStorageList}</ul>;
    } else return <div></div>;
  }
}

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
      price: 0,
      tenants: [],
      priceToFilter: 0,
      locationToFilter: "",
      capacityToFilter: 0,
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

      var _coldStorageIDs = await instance.methods.getColdStorageIDs().call();

      for (let i = 0; i < _coldStorageIDs.length; i++) {
        let obj = await instance.methods
          .getColdStorage(_coldStorageIDs[i])
          .call();
        this.state.coldStorageDetails.push(obj);
      }

      var _requestedIDs = await instance.methods
        .getCSrequested(accounts[0])
        .call();

      for (let i = 0; i < _requestedIDs.length; i++) {
        if (_requestedIDs[i] != 0) {
          let obj = await instance.methods
            .getColdStorage(_requestedIDs[i])
            .call();
          console.log(obj);
          this.state.requestedStorages.push(obj);
        }
      }

      this.setState({
        ColdStorageInstance: instance,
        web3: web3,
        account: accounts[0],
        coldStorageIDs: _coldStorageIDs,
        requestedIDs: _requestedIDs,
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
        <Row>
          <Col sm>
            <h1 style={{ fontSize: "30px" }}>Available cold storages </h1>
            <AvailableStorages
              coldStorageIDs={this.state.coldStorageIDs}
              coldStorageDetails={this.state.coldStorageDetails}
              locationToFilter={this.state.locationToFilter}
              priceToFilter={this.state.priceToFilter}
              capacityToFilter={this.state.capacityToFilter}
              instance={this.state.ColdStorageInstance}
              account={this.state.account}
            />
          </Col>
          <Col sm>
            <h1 style={{ fontSize: "30px" }}>Requested cold storages </h1>
            <RequestedStorages
              requestedIDs={this.state.requestedIDs}
              requestedStorages={this.state.requestedStorages}
              instance={this.state.ColdStorageInstance}
              account={this.state.account}
            />
          </Col>
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
