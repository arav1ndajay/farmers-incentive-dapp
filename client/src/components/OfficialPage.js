import React, { Component } from "react";
import NavBar from "./NavBar";
import getWeb3 from "../getWeb3";
import GovContract from "../contracts/GovContract.json";

class OfficialPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      GovInstance: undefined,
      account: null,
      web3: null,
      name: "",
      govID: "",
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
        GovInstance: instance,
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

  addGovOfficial = async () => {
    await this.state.GovInstance.methods
      .addGovOfficial(this.state.account, this.state.name, this.state.govID)
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
          <div className="header">Government Official Registration</div>
          <form className="add-form">
            <div className="form-control">
              <label>Name</label>
              <input
                type="text"
                value={this.state.name}
                onChange={(event) =>
                  this.setState({ name: event.target.value })
                }
                placeholder="Enter your name"
              />
            </div>
            <div className="form-control">
              <label>Gov ID</label>
              <input
                type="text"
                value={this.state.govID}
                onChange={(event) =>
                  this.setState({ govID: event.target.value })
                }
                placeholder="Enter your Gov ID"
              />
            </div>

            <button
              className="btn"
              style={{ marginTop: "30px" }}
              onClick={this.addGovOfficial}
            >
              Submit Details
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default OfficialPage;
