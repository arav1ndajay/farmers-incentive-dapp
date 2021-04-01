import React, { Component } from "react";
import NavBar from "./NavBar";
import getWeb3 from "../getWeb3";
import GovContract from "../contracts/GovContract.json";

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
      const deployedNetwork = GovContract.networks[networkId];
      const instance = new web3.eth.Contract(
        GovContract.abi,
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

  updateAddressOfFarmer = (event) => {
    this.setState({ addressOfFarmer: event.target.value });
  };

  viewFarmerDetails = async () => {
    try {
      farmerDetails = await this.state.FarmerInstance.methods
        .getFarmerDetails(this.state.addressOfFarmer)
        .call({ from: this.state.account });

      console.log(farmerDetails);
      this.setState({ viewDetails: true });
    } catch (error) {
      this.setState({ viewDetails: false });
      alert("Invalid address, please try again!");
      console.error(error);
    }
  };

  setFarmerAsEligible = async () => {
    await this.state.FarmerInstance.methods
      .setFarmerAsEligible(this.state.addressOfFarmer)
      .send({
        from: this.state.account,
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
      </div>
    );
  }
}
export default OfficialProfile;
