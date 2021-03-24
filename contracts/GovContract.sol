pragma solidity >=0.4.21;

import "./FarmerContract.sol";

contract GovContract {
    FarmerContract public fc;

    constructor(address _address) public {
        fc = FarmerContract(_address);
    }

    function getFarmerDetails(address _address)
        public
        view
        returns (
            string memory _name,
            string memory _stateOfResidence,
            string memory _gender,
            uint256 _landOwned,
            bool _isEligible
        )
    {
        return fc.getFarmer(_address);
    }

    function setFarmerAsEligible(address _address) public {
        fc.setEligible(_address);
    }
}
