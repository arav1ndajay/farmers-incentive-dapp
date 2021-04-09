import React from "react";
import NavBar from "./NavBar";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import RegisteredContracts from "./RegisteredContracts";

class DescToList extends React.Component {
  render() {
    var policies = this.props.policyDescriptions;
    var policyList = policies.map(function (policies, index) {
      return (
        <Card key={index} style={{ margin: "20px" }}>
          <h2>Policy ID: {policies.policyID}</h2>
          <p>{policies.description}</p>
          <Link to="/">Redeem</Link>
        </Card>
      );
    });

    return <ul>{policyList}</ul>;
  }
}

class ArrayToList extends React.Component {
  render() {
    var policies = this.props.policies;
    var details = this.props.policyDetails;
    var policyList = policies.map(function (policies, index) {
      return (
        <Card key={index} style={{ margin: "20px" }}>
          <h2>Policy ID: {policies}</h2>
          <ul>
            <li>Maximum Land you can own: {details[index]._maxLandReq}</li>
            <li>
              Applicable for {details[index]._gender} gender and for farmers
              residing in {details[index]._stateOfResidence}
            </li>
            <Link to="/">Redeem</Link>
          </ul>
        </Card>
      );
    });

    return <ul>{policyList}</ul>;
  }
}

class FarmerProfile extends React.Component {
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
      policies: [],
      policyDetails: [],
      policyDescriptions: [],
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
      var _details = await instance.methods
        .getFarmer(accounts[0])
        .call({ from: accounts[0] });
      let _policies = await instance.methods
        .getPoliciesAvailable(accounts[0])
        .call({ from: accounts[0] });

      for (let i = 0; i < _policies.length; i++) {
        let obj = await instance.methods
          .getPolicy(_policies[i])
          .call({ from: accounts[0] });
        this.state.policyDetails.push(obj);
      }

      this.setState({
        FarmerInstance: instance,
        web3: web3,
        account: accounts[0],
        name: _details._name,
        stateOfResidence: _details._stateOfResidence,
        landOwned: _details._landOwned,
        gender: _details._gender,
        policies: _policies,
      });

      // FOR LOOP
      var _policyDescriptions = [];
      for (let i = 0; i < RegisteredContracts.length; i++) {
        const deployedNetwork = RegisteredContracts[i][1];

        const instance = new web3.eth.Contract(
          RegisteredContracts[i][0],
          deployedNetwork && deployedNetwork.address
        );

        var desc = {
          description: "",
          policyID: null,
        };

        let obj = await instance.methods.description().call();
        desc.description = obj._description;
        desc.policyID = obj._policyID;
        var isEligible = await instance.methods
          .isEligible(this.state.account)
          .call();

        if (isEligible) {
          _policyDescriptions.push(desc);
        }
      }

      this.setState({ policyDescriptions: _policyDescriptions });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  viewPolicies = async () => {
    try {
      var policyDetails = await this.state.FarmerInstance.methods
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
        <div className="row">
          <div className="col-7">
            <h1>Available policies </h1>
            <ArrayToList
              policies={this.state.policies}
              policyDetails={this.state.policyDetails}
            />
            <DescToList policyDescriptions={this.state.policyDescriptions} />
          </div>
          <div className="col-5">
            <Card style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Farmer
                </Card.Subtitle>
                <ListGroup variant="flush">
                  <ListGroup.Item>Name : {this.state.name}</ListGroup.Item>
                  <ListGroup.Item>Gender : {this.state.gender} </ListGroup.Item>
                  <ListGroup.Item>
                    State of residence : {this.state.stateOfResidence}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Land Owned : {this.state.landOwned} acre
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default FarmerProfile;
