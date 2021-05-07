import React from "react";
import { Card } from "react-bootstrap";
import RegisteredContracts from "./RegisteredContracts";
import NavBar from "./NavBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

let farmerAccounts = [];

class ArrayToCards extends React.Component {
  render() {
    var policies = this.props.policies;
    const web3 = this.props.web3;
    const account = this.props.account;

    var policyList = policies.map(function (policyObj, index) {
      return (
        <Col>
          <ContractCard
            web3={web3}
            account={account}
            abi={policyObj[0]}
            deployedNetwork={policyObj[1]}
          />
        </Col>
      );
    });

    return <Row>{policyList}</Row>;
  }
}

class ContractCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "0",
      instance: null,
      loading: false,
      eligibleFarmers: undefined,
      numberOfEligibleFarmers: 0,
      policyID: null,
      policyDescription: null,
      currentFund: 0,
    };
  }

  async getDetails() {
    const instance = new this.props.web3.eth.Contract(
      this.props.abi,
      this.props.deployedNetwork && this.props.deployedNetwork.address
    );

    let _currentFund = await this.props.web3.eth.getBalance(
      this.props.deployedNetwork && this.props.deployedNetwork.address
    );

    let policyData = await instance.methods.description().call();
    let _policyDescription = policyData._description;
    let _policyID = policyData._policyID;

    let _eligibleFarmers = [];

    for (let i = 0; i < farmerAccounts.length; i++) {
      let isEligible = await instance.methods
        .isEligible(farmerAccounts[i])
        .call();
      console.log("Entry is");
      console.log(farmerAccounts[i]);
      console.log(isEligible);

      if (isEligible == true) {
        _eligibleFarmers.push(farmerAccounts[i]);
      }
    }

    this.setState({
      instance: instance,
      eligibleFarmers: _eligibleFarmers,
      numberOfEligibleFarmers: _eligibleFarmers.length,
      policyDescription: _policyDescription,
      policyID: _policyID,
      currentFund: _currentFund,
    });
  }

  componentDidMount() {
    this.getDetails().then(() => {
      if (this.state.eligibleFarmers != undefined) {
        this.setState({ loading: false });
      }
    });
  }

  fund = async () => {
    await this.state.instance.methods.fund().send({
      from: this.props.account,
      value: this.state.value,
      gasPrice: 1,
    });
  };

  updateValue = (event) => {
    this.setState({ value: event.target.value });
  };

  action = async () => {
    for (let i = 0; i < this.state.eligibleFarmers.length; i++) {
      await this.state.instance.methods
        .action(this.state.eligibleFarmers[i])
        .send({
          from: this.props.account,
          gasPrice: 1,
        });
    }
  };

  render() {
    if (this.state.loading === false) {
      console.log("Type is");
      console.log(typeof this.state.eligibleFarmers);
      return (
        <div>
          <Card style={{ margin: "20px" }}>
            <h2>Policy ID: {this.state.policyID}</h2>
            <p>{this.state.policyDescription}</p>
            <h4>
              {" "}
              Number of farmers eligible : {this.state.numberOfEligibleFarmers}
            </h4>
            <h4>Current Funds : {this.state.currentFund}</h4>
            <div className="form-control">
              <label>Value</label>
              <input
                type="text"
                placeholder="Enter Amount in wei"
                value={this.state.value}
                onChange={this.updateValue}
              />
            </div>
            <button
              className="btn"
              style={{ marginBottom: "30px" }}
              onClick={this.fund}
            >
              Fund
            </button>

            <button
              className="btn"
              style={{ marginBottom: "30px" }}
              onClick={this.action}
            >
              Execute
            </button>
          </Card>
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }
}

class ManageContracts extends React.Component {
  constructor(props) {
    super(props);
    farmerAccounts = this.props.farmerAccounts;
  }

  render() {
    return (
      <div>
        <NavBar />
        <ArrayToCards
          web3={this.props.web3}
          account={this.props.account}
          policies={RegisteredContracts}
        />
      </div>
    );
  }
}

export default ManageContracts;
