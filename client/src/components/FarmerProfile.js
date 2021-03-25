import React from "react";
import NavBar from "./NavBar";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";


class ArrayToList extends React.Component{
    render()
    {
        var policies = this.props.policies;

        var policyList = policies.map(function(policies, index){
                return <li key={ index }>{policies}</li>;
        })

        return (
            <ul>
                {policyList}
            </ul>
            )
    }
}

class FarmerProfile extends React.Component{

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
          policies: []
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
            var _details = await instance.methods.getFarmer(accounts[0]).call({from : accounts[0]});
            let _policies = await instance.methods.getPoliciesAvailable(accounts[0]).call({from:accounts[0]});

            this.setState({
                FarmerInstance: instance,
                web3: web3,
                account: accounts[0],
                name: _details._name,
                stateOfResidence: _details._stateOfResidence,
                landOwned: _details._landOwned,
                gender: _details._gender,
                policies: _policies
            });

            console.log("Policies available are");
            console.log(this.state.policies);
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
    
    render()
    {
        return (
            <div>
            <NavBar/>
                <h1> Name</h1>
                <h2> {this.state.name}</h2>
                <h1> Gender</h1>
                <h2> {this.state.gender}</h2>
                <h1> State of Residence </h1>
                <h2> {this.state.stateOfResidence}</h2>
                <h1> Land owned </h1>
                <h2> {this.state.landOwned}</h2>
                <h1>Available policy ids</h1>
                <ArrayToList policies = {this.state.policies} />
            </div>
        );
    }
};

export default FarmerProfile;
