pragma solidity >=0.4.21 <0.7.0;

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
            string memory _placeOfResidence,
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
