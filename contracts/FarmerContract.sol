// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;
import "./Roles.sol";
import "./PolicyContract.sol";

contract FarmerContract {
    Roles public rc;
    PolicyContract public pc;

    constructor(address _rcAddress, address _pcAddress) public {
        rc = Roles(_rcAddress);
        pc = PolicyContract(_pcAddress);
    }

    struct Farmer {
        string name;
        string stateOfResidence;
        string gender;
        uint256 landOwned;
        uint256[] policiesAvailable;
        bool isEligible;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAccounts;

    function addFarmer(
        address _address,
        string memory _name,
        string memory _stateOfResidence,
        string memory _gender,
        uint256 _landOwned
    ) public {
        Farmer storage farmer = farmers[_address];
        farmer.name = _name;
        farmer.stateOfResidence = _stateOfResidence;
        farmer.gender = _gender;
        farmer.landOwned = _landOwned;
        farmer.isEligible = false;

        farmerAccounts.push(_address);

        rc.addRole(_address, rc.farmerRoleID());
    }

    function getFarmers() public view returns (address[] memory) {
        return farmerAccounts;
    }

    function getPoliciesAvailable(address _address)
        public
        returns (uint256[] memory)
    {
        uint256[] memory listOfPolicies = getPolicies();
        Farmer storage farmer = farmers[_address];

        for (uint256 i = 0; i < listOfPolicies.length; i++) {
            uint256 _maxLandReq;
            string memory _gender;
            string memory _stateOfResidence;
            bool acceptedPolicy = true;

            (_maxLandReq, _gender, _stateOfResidence) = getPolicy(
                listOfPolicies[i]
            );
            if (_maxLandReq > 0 && farmer.landOwned > _maxLandReq) {
                acceptedPolicy = false;
            }
            if (
                keccak256(abi.encodePacked(_gender)) !=
                keccak256(abi.encodePacked("all")) &&
                keccak256(abi.encodePacked(_gender)) !=
                keccak256(abi.encodePacked(farmer.gender))
            ) {
                acceptedPolicy = false;
            }
            if (
                keccak256(abi.encodePacked(_stateOfResidence)) !=
                keccak256(abi.encodePacked("")) &&
                keccak256(abi.encodePacked(_stateOfResidence)) !=
                keccak256(abi.encodePacked(farmer.stateOfResidence))
            ) {
                acceptedPolicy = false;
            }
            if (acceptedPolicy == true) {
                farmer.policiesAvailable.push(listOfPolicies[i]);
            }
        }
        return farmer.policiesAvailable;
    }

    function getPolicies() public view returns (uint256[] memory) {
        return pc.getPolicies();
    }

    function getPolicy(uint256 _policyId)
        public
        view
        returns (
            uint256 _maxLandReq,
            string memory _gender,
            string memory _stateOfResidence
        )
    {
        return pc.getPolicy(_policyId);
    }

    function getFarmer(address _address)
        public
        view
        returns (
            string memory _name,
            string memory _stateOfResidence,
            string memory _gender,
            uint256 _landOwned,
            bool isEligible
        )
    {
        return (
            farmers[_address].name,
            farmers[_address].stateOfResidence,
            farmers[_address].gender,
            farmers[_address].landOwned,
            farmers[_address].isEligible
        );
    }

    function countFarmers() public view returns (uint256) {
        return farmerAccounts.length;
    }

    function setEligible(address _address) public {
        farmers[_address].isEligible = true;
    }
}
