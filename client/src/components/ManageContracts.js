import React, { Component } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Roles from "../contracts/Roles.json";
import getWeb3 from "../getWeb3";
import FarmerProfile from "./FarmerProfile";
import FarmerContract from "../contracts/FarmerContract.json";
import GovContract from "../contracts/GovContract.json";
import OfficialProfile from "./OfficialProfile";
import RegisteredContracts from "./RegisteredContracts";
import Login from "./login";
import NavBar from "./NavBar";

let farmerAccounts = [];

class ContractCard extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            value : '0',
            instance : null,
            loading : false,
            eligibleFarmers : undefined,
            numberOfEligibleFarmers : 0,
            policyID: null,
            policyDescription : null,
            currentFund : 0
        };
    }

    async getDetails()
    {
        const instance = new this.props.web3.eth.Contract(
            this.props.abi,
            this.props.deployedNetwork && this.props.deployedNetwork.address
        );
        
        let _currentFund = await this.props.web3.eth.getBalance(this.props.deployedNetwork && this.props.deployedNetwork.address);
       
        let policyData = await instance.methods.description().call();
        let _policyDescription = policyData._description;
        let _policyID = policyData._policyID;
        
        let _eligibleFarmers = [];

        for(let i=0;i<farmerAccounts.length;i++)
        {
            let isEligible = await instance.methods.isEligible(farmerAccounts[i]).call();
            console.log("Entry is");
            console.log(farmerAccounts[i]);
            console.log(isEligible);

            if(isEligible == true)
            {
              _eligibleFarmers.push(farmerAccounts[i]);
            }
        }


        this.setState(
        {
            instance : instance,
            eligibleFarmers: _eligibleFarmers,
            numberOfEligibleFarmers : _eligibleFarmers.length,
            policyDescription : _policyDescription,
            policyID: _policyID,
            currentFund : _currentFund
        }
        );
    }

    componentDidMount() {
        this.getDetails().then( () => {
                if(this.state.eligibleFarmers != undefined)
                {
                    this.setState({loading : false});
                }
            }
            );
    }

    fund = async() =>
    {
       await this.state.instance.methods
      .fund()
      .send({
        from: this.props.account,
        value: this.state.value,
        gas: 1000000
      });
    };

    updateValue = (event) =>
    {
        this.setState(
            {value : event.target.value}
        )
    }

    action = async() =>
    {
        for(let i=0;i<this.state.eligibleFarmers.length;i++)
        {

            await this.state.instance.methods.action(this.state.eligibleFarmers[i]).send({
                from: this.props.account,
                gas: 1000000
                });
        
        }
    }

    render()
    {
        if(this.state.loading === false)
        {
            console.log("Type is");
            console.log(typeof(this.state.eligibleFarmers));
            return   (
                <div>
                    {/* <div className="form-control">
                    <label>Value</label>
                    <input
                        type="text"
                        placeholder="Enter Amount in wei"
                        value={this.state.value}
                        onChange={this.updateValue}
                    />
                    </div>
                    <button className="btn"
                    style={{ marginBottom: "30px" }}
                    onClick = {this.fund}>
                        Fund
                    </button>

                    <button className ="btn"style={{ marginBottom: "30px" }}
                    onClick = {this.action}>
                        Execute
                    </button> */}

                <Card style={{ margin: "20px" }}>
                    <h2>Policy ID: {this.state.policyID}</h2>
                    <p>{this.state.policyDescription}</p>
                    <h4> Number of farmers eligible : {this.state.numberOfEligibleFarmers}</h4>
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
                    <button className ="btn" style={{ marginBottom: "30px" }}
                    onClick = {this.fund}>
                        Fund
                    </button>

                    <button className ="btn"style={{ marginBottom: "30px" }}
                    onClick = {this.action}>
                        Execute
                    </button>
                </Card>
                </div>
            );
        }
        else
        {
            return (<h1>Loading</h1>);
        }
    }
}


class ManageContracts extends React.Component
{
    constructor(props)
    {
        super(props);
        farmerAccounts = this.props.farmerAccounts;
    }

    render()
    {
        return(
            <div>
            <NavBar/>
            <div class ="Row">
                <div class = "col-6">
                <ContractCard web3 = {this.props.web3} account = {this.props.account} abi = {RegisteredContracts[0][0]} deployedNetwork = {RegisteredContracts[0][1]} />
                </div>
            </div>
            </div>
        );
    }
}


export default ManageContracts;