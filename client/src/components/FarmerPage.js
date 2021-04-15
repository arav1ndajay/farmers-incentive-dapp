import React, { Component } from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";

var policyDetails;

class FarmerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      FarmerInstance: undefined,
      account: null,
      web3: null,
      name: "",
      stateOfResidence: "",
      gender: "",
      landOwned: 0,
    };
  }

  updateName = (event) => {
    this.setState({ name: event.target.value });
  };

  updateStateOfResidence = (event) => {
    this.setState({ stateOfResidence: event.target.value });
  };

  updateLandOwned = (event) => {
    this.setState({ landOwned: event.target.value });
  };

  updateGender = (event) => {
    this.setState({ gender: event.target.value });
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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  addFarmer = async (event) => {
    event.preventDefault();
    await this.state.FarmerInstance.methods
      .addFarmer(
        this.state.account,
        this.state.name,
        this.state.stateOfResidence,
        this.state.gender,
        this.state.landOwned
      )
      .send({
        from: this.state.account,
        gas: 1000000,
      });
  };

  viewPolicies = async () => {
    try {
      policyDetails = await this.state.FarmerInstance.methods
        .getPoliciesAvailable(this.state.account)
        .call({ from: this.state.account });
      if (policyDetails.length === 0) alert("No policies available!");
      console.log(policyDetails);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <NavBar />
        <h4 style={{ textAlign: "center" }}>
          Account address: {this.state.account}
        </h4>
        <div className="container">
          <div className="header">Farmer Registration</div>
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
              <label>State of Residence</label>
              <select
                style={{ fontSize: "25px", width: "600px" }}
                value={this.state.stateOfResidence}
                onChange={this.updateStateOfResidence}
              >
                <option value="">Select</option>
                <option value="kerala">Kerala</option>
                <option value="bihar">Bihar</option>
                <option value="andhrapradesh">Andhra Pradesh</option>
                <option value="telangana">Telangana</option>
                <option value="goa">Goa</option>
                <option value="maharasthra">Maharasthra</option>
                <option value="arunachalpradesh">Arunachal Pradesh</option>
                <option value="assam">Assam</option>
                <option value="chhattisgarh">Chhattisgarh</option>
                <option value="gujarat">Gujarat</option>
                <option value="haryana">Haryana</option>
                <option value="himachalpradesh">Himachal Pradesh</option>
                <option value="jharkhand">Jharkhand</option>
                <option value="karnataka">Karnataka</option>
                <option value="madhyapradesh">Madhya Pradesh</option>
                <option value="manipur">Manipur</option>
                <option value="meghalaya">Meghalaya</option>
                <option value="mizoram">Mizoram</option>
                <option value="nagaland">Nagaland</option>
                <option value="odisha">Odisha</option>
                <option value="punjab">Punjab</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="sikkim">Sikkim</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="tripura">Tripura</option>
                <option value="uttarpradesh">Uttar Pradesh</option>
                <option value="uttarakhand">Uttarakhand</option>
                <option value="westbengal">West Bengal</option>
              </select>
            </div>

            <div className="form-control">
              <label>Gender</label>
              <select
                style={{ fontSize: "25px", width: "600px" }}
                value={this.state.gender}
                onChange={this.updateGender}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
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
