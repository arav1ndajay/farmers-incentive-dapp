import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import ColdStorageContract from "../contracts/ColdStorageContract.json";

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
      coldStorageID: null,
      tenants: [],
    };
  }

  updateOwnerName = (event) => {
    this.setState({ ownerName: event.target.value });
  };

  updateLocation = (event) => {
    this.setState({ location: event.target.value });
  };

  updateCapacity = (event) => {
    this.setState({ capacity: event.target.value });
  };

  updateColdStorageID = (event) => {
    this.setState({ coldStorageID: event.target.value });
  };

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        ColdStorageInstance: instance,
        web3: web3,
        account: accounts[0],
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  addColdStorage = async () => {
    await this.state.ColdStorageInstance.methods
      .addColdStorage(
        this.state.coldStorageID,
        this.state.ownerName,
        this.state.location,
        this.state.capacity,
        this.state.account
      )
      .send({
        from: this.state.account,
        gas: 1000000,
      });
  };

  render() {
    return (
      <div>
        <NavBar />
        <h4 style={{ textAlign: "center" }}>
          Account address: {this.state.account}
        </h4>
        <div className="container">
          <div className="header">Cold Storage Registration</div>
          <form className="add-form">
            <div className="form-control">
              <label>Owner Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.ownerName}
                onChange={this.updateOwnerName}
              />
            </div>
            <div className="form-control">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter location of cold storage"
                value={this.state.location}
                onChange={this.updateLocation}
              />
            </div>
            <div className="form-control">
              <label>Capacity</label>
              <input
                type="text"
                placeholder="Enter capacity of cold storage"
                value={this.state.capacity}
                onChange={this.updateCapacity}
              />
            </div>
            <button
              className="btn"
              style={{ marginTop: "30px" }}
              onClick={this.addColdStorage}
            >
              Submit Details
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default ColdStoragePage;
