import React from "react";
import NavBar from "./NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import PolicyContract from "../contracts/PolicyContract.json";

class PolicyMakerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      FarmerInstance: undefined,
      account: null,
      web3: null,
      policyId: "",
      maxLandReq: 0,
      gender: "all",
      stateOfResidence: "",
    };
  }

  updatePolicyId = (event) => {
    this.setState({ policyId: event.target.value });
  };

  updateMaxLandReq = (event) => {
    this.setState({ maxLandReq: event.target.value });
  };

  updateGender = (event) => {
    this.setState({ gender: event.target.value });
  };

  updateStateOfResidence = (event) => {
    this.setState({ stateOfResidence: event.target.value });
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
      const deployedNetwork = PolicyContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PolicyContract.abi,
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

  addPolicy = async () => {
    await this.state.FarmerInstance.methods
      .addPolicy(
        this.state.policyId,
        this.state.maxLandReq,
        this.state.gender,
        this.state.stateOfResidence
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
        <div className="container">
          <div className="header">Policy Maker Page</div>
          <h4>Enter details for new policy </h4>
          <form className="add-form">
            <div className="form-control">
              <label>Policy ID</label>
              <input
                type="text"
                placeholder="Enter new ID"
                value={this.state.policyId}
                onChange={this.updatePolicyId}
              />
            </div>
            <div className="form-control">
              <label>Maximum land requirement</label>
              <input
                type="text"
                placeholder="Land below which farmer shall receive benefit"
                value={this.state.maxLandReq}
                onChange={this.updateMaxLandReq}
              />
            </div>
            <div className="form-control">
              <label>Gender eligibility</label>
              <select
                style={{ fontSize: "25px", width: "600px" }}
                value={this.state.gender}
                onChange={this.updateGender}
              >
                <option value="all">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>
            <div className="form-control">
              <label>State of Residence</label>
              <select
                style={{ fontSize: "25px", width: "600px" }}
                value={this.state.stateOfResidence}
                onChange={this.updateStateOfResidence}
              >
                <option value="select">Select</option>
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
            <button
              className="btn"
              style={{ marginTop: "30px" }}
              onClick={this.addPolicy}
            >
              Create New Policy
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default PolicyMakerPage;
