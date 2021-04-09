import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
class ArrayToList extends React.Component {
  render() {
    var coldStorageIDs = this.props.coldStorageIDs;
    var coldStorageDetails = this.props.coldStorageDetails;

    //conditions to filter
    var locationToFilter = this.props.locationToFilter.toLowerCase();
    var priceToFilter = this.props.priceToFilter;
    var capacityToFilter = this.props.capacityToFilter;

    var coldStorageList = coldStorageIDs.map(function (ID, index) {
      if (
        (coldStorageDetails[index]._location
          .toLowerCase()
          .includes(locationToFilter) ||
          locationToFilter == "") &&
        (priceToFilter == 0 ||
          parseInt(coldStorageDetails[index]._price) / 10 ** 18 <=
            priceToFilter) &&
        (capacityToFilter == 0 ||
          parseInt(coldStorageDetails[index]._capacity) >= capacityToFilter)
      ) {
        return (
          <Card key={index} style={{ margin: "20px" }}>
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
              <Link to="/">Request cold storage</Link>
            </ul>
          </Card>
        );
      }
    });

    return <ul>{coldStorageList}</ul>;
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

      var _coldStorageIDs = await instance.methods
        .getColdStorageIDs()
        .call({ from: accounts[0] });

      for (let i = 0; i < _coldStorageIDs.length; i++) {
        let obj = await instance.methods
          .getColdStorage(_coldStorageIDs[i])
          .call({ from: accounts[0] });
        this.state.coldStorageDetails.push(obj);
      }

      this.setState({
        ColdStorageInstance: instance,
        web3: web3,
        account: accounts[0],
        coldStorageIDs: _coldStorageIDs,
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
          <Col>
            <h1 style={{ textAlign: "center" }}>Available cold storages </h1>
            <ArrayToList
              coldStorageIDs={this.state.coldStorageIDs}
              coldStorageDetails={this.state.coldStorageDetails}
              locationToFilter={this.state.locationToFilter}
              priceToFilter={this.state.priceToFilter}
              capacityToFilter={this.state.capacityToFilter}
            />
          </Col>
          <Col>
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
