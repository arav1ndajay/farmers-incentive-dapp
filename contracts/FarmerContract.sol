// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;
import "./Roles.sol";

contract FarmerContract {
    Roles rc;

    constructor(address _rcAddress) public {
        rc = Roles(_rcAddress);
    }

    modifier OnlyGovernmentOfficial() {
        require(
            (rc.getRole(tx.origin) == rc.governmentOfficialRoleID() ||
                rc.getRole(tx.origin) == rc.adminRoleID()),
            "Only Gov official or admin"
        );

        _;
    }

    modifier OnlyAdmin() {
        require(rc.getRole(tx.origin) == rc.adminRoleID(), "Only admin");

        _;
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
    address payable[] public farmerAccounts;
    address payable[] public unverifiedFarmerAccounts;

    function addFarmer(
        address payable _address,
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
    }

    function getFarmers() public view returns (address payable[] memory) {
        return farmerAccounts;
    }

    function getUnverifiedFarmers() public returns (address payable[] memory) {
        delete unverifiedFarmerAccounts;
        uint256 i = 0;

        for (i = 0; i < farmerAccounts.length; i++) {
            if (rc.getRole(farmerAccounts[i]) == 0) {
                unverifiedFarmerAccounts.push(farmerAccounts[i]);
            }
        }

        return unverifiedFarmerAccounts;
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

    function setEligible(address _address) public OnlyGovernmentOfficial() {
        farmers[_address].isEligible = true;
        rc.addRole(_address, rc.farmerRoleID());
    }
}
