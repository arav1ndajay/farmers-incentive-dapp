// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;
import "./FarmerContract.sol";

/*

 Step 1
    The contract must contain 3 functions
    "isEligible" to check if farmer is eligible for the contract
    "description" to determine what is to be shown on screen
    "execution" to perform desired actions on the farmer, including transfer of ETH etc.
    
 Step 2
    Create the appropriate deploy script for your contract and deploy your contract.

 Step 3
    Add your contract abi, address in RegisteredContracts.

 Step 4
    You are done! Eligible farmers can now see your contract.

*/

contract Policy_2 {
    FarmerContract public fc;

    // ID number of your policy
    uint256 policyID = 32124;

    constructor(address _fcAddress) public {
        fc = FarmerContract(_fcAddress);
    }

    // Code to check if farmer is eligible for the policy
    function isEligible(address _farmerAddress) public view returns (bool) {
        string memory _name;
        string memory _stateOfResidence;
        string memory _gender;
        uint256 _landOwned;
        bool isVerified;

        (_name, _stateOfResidence, _gender, _landOwned, isVerified) = fc
            .getFarmer(_farmerAddress);

        if (_landOwned < 5) return true;
        return false;
    }

    // Description of policy (what should be shown on screen)
    function description()
        public
        view
        returns (string memory _description, uint256 _policyID)
    {
        return (
            "You are eligible for Pradham mantri yojana scheme, you have land less than 5",
            policyID
        );
    }

    // execution (Transfer of money etc)
}
