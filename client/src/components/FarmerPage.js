import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";

var numOfFarmers = 0;

class FarmerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FarmerInstance: undefined,
      account: null,
      web3: null,
      name: "",
      placeOfResidence: "",
      landOwned: 0,
    };
  }

  updateName = (event) => {
    this.setState({ name: event.target.value });
  };

  updatePlaceOfResidence = (event) => {
    this.setState({ placeOfResidence: event.target.value });
  };

  updateLandOwned = (event) => {
    this.setState({ landOwned: event.target.value });
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
      const deployedNetwork = FarmerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FarmerContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        FarmerInstance: instance,
        web3: web3,
        account: accounts[0],
      });
      numOfFarmers = await this.state.FarmerInstance.methods
        .farmerCount()
        .call();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  addFarmer = async () => {
    for (var i = 0; i < numOfFarmers; i++) {
      const f = await this.state.FarmerInstance.methods.farmerDetails(i).call();
      console.log(f);
    }
    await this.state.FarmerInstance.methods
      .addFarmer(
        this.state.name,
        this.state.placeOfResidence,
        this.state.landOwned
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
        <h1 style={{ textAlign: "center" }}>Farmer id: {numOfFarmers}</h1>
        <div className="container">
          <div className="header">Farmer Details</div>
          <form className="add-form">
            <div className="form-control">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={this.state.name}
                onChange={this.updateName}
              />
            </div>
            <div className="form-control">
              <label>Land owned</label>
              <input
                type="text"
                placeholder="Enter area in acres"
                value={this.state.landOwned}
                onChange={this.updateLandOwned}
              />
            </div>
            <div className="form-control">
              <label>Place of residence</label>
              <input
                type="text"
                placeholder="Enter village/town name"
                value={this.state.placeOfResidence}
                onChange={this.updatePlaceOfResidence}
              />
            </div>
            <button
              className="btn"
              style={{ marginTop: "30px" }}
              onClick={this.addFarmer}
            >
              Submit Details
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default FarmerPage;
