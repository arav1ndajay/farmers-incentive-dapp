import React from "react";
import "../App.css";
import { Redirect } from "react-router-dom";
import Roles from "../contracts/Roles.json";
import getWeb3 from "../getWeb3";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

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

    console.log(instance);
    var _roleID = await instance.methods.getRole(accounts[0]).call();
    this.setState({
      RolesInstance: instance,
      web3: web3,
      account: accounts[0],
      roleID: _roleID,
    });

  };

  render() {

    if (this.state.roleID == 1) {
      return <Redirect to="/FarmerProfile" />;
    }
    return (
      <div>
        <NavBar/>
        <h3>Lmao, You have not registered, please register as Farmer, Official or Policy maker</h3>
        <Link to ="/" className ="btn btn-primary">Home</Link>
      </div>
    );
  }
}

export default Login;
