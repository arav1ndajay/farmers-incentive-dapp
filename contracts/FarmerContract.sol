pragma solidity >=0.4.21 <0.7.0;

contract FarmerContract {
    struct Farmer {
        string name;
        string placeOfResidence;
        uint256 landOwned;
        bool isEligible;
    }

    mapping(address => Farmer) public farmers;
    address[] public farmerAccounts;

    function addFarmer(
        address _address,
        string memory _name,
        string memory _placeOfResidence,
        uint256 _landOwned
    ) public {
        Farmer storage farmer = farmers[_address];
        farmer.name = _name;
        farmer.placeOfResidence = _placeOfResidence;
        farmer.landOwned = _landOwned;
        farmer.isEligible = false;

        farmerAccounts.push(_address) - 1;
    }

    function getFarmers() public view returns (address[] memory) {
        return farmerAccounts;
    }

    function getFarmer(address _address)
        public
        view
        returns (
            string memory _name,
            string memory _placeOfResidence,
            uint256 _landOwned,
            bool isEligible
        )
    {
        return (
            farmers[_address].name,
            farmers[_address].placeOfResidence,
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
