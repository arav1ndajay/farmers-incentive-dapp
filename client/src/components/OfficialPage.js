import React, { Component } from "react";
import NavBar from "./NavBar";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";

var farmerDetails;

class OfficialPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FarmerInstance: undefined,
      account: null,
      web3: null,
      idOfFarmer: 0,
      viewDetails: false,
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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateIdOfFarmer = (event) => {
    this.setState({ idOfFarmer: event.target.value });
  };

  viewFarmerDetails = async () => {
    farmerDetails = await this.state.FarmerInstance.methods
      .farmerDetails(this.state.idOfFarmer)
      .call();
    this.setState({ viewDetails: true });
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
              <label>Id of farmer</label>
              <input
                type="text"
                value={this.state.idOfFarmer}
                onChange={this.updateIdOfFarmer}
                placeholder="Enter id of farmer"
              />
            </div>
            <button
              className="btn"
              style={{ marginBottom: "30px" }}
              onClick={this.viewFarmerDetails}
            >
              View Details
            </button>
            <input type="submit" value="Set as eligible" className="btn" />
          </form>
          {this.state.viewDetails === true && (
            <div>
              <h4 style={{ textAlign: "center" }}>
                Details of farmer {this.state.idOfFarmer}
              </h4>
              <div style={{ textAlign: "center" }}>
                Name: {farmerDetails.name}
              </div>
              <div style={{ textAlign: "center" }}>
                Land Owned: {farmerDetails.landOwned}
              </div>
              <div style={{ textAlign: "center" }}>
                Place of Residence: {farmerDetails.placeOfResidence}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default OfficialPage;
