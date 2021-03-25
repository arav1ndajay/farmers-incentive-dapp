import React, { Component } from "react";
import "../App.css";
import { Redirect } from "react-router-dom";
import Roles from "../contracts/Roles.json";
import getWeb3 from "../getWeb3";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      RolesInstance: undefined,
      web3: null,
      account: null,
      roleID: 0,
    };
  }

  componentWillMount = async () => {
    console.log("This happpens");
    // Get network provider and web3 instance.
    const web3 = await getWeb3();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Roles.networks[networkId];
    const instance = new web3.eth.Contract(
      Roles.abi,
      deployedNetwork && deployedNetwork.address
    );

    console.log("Instance is");
    console.log(instance);
    var _roleID = await instance.methods.getRole(accounts[0]).call();
    this.setState({
      RolesInstance: instance,
      web3: web3,
      account: accounts[0],
      roleID: _roleID,
    });
    console.log("ROLE ID IS");
    console.log(this.state.roleID);
  };

  render() {
    console.log("Role ID received is");
    console.log(this.state.roleID);

    if (this.state.roleID === 1) {
      console.log("Ummmm?");
      return (
        <div>
          <h1>You are now a farmer</h1>
        </div>
      );
    }
    return (
      <div>
        Lol
        {this.state.account}
      </div>
    );
  }
}

export default Login;
