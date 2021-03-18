pragma solidity >=0.4.21 <0.7.0;

contract FarmerContract {
    address public owner;
    uint256 public farmerCount;

    // Constructor
    constructor() public {
        owner = msg.sender;
        farmerCount = 0;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // // Only Admin can access
    // modifier onlyAdmin() {
    //     require(msg.sender == owner);
    //     _;
    // }

    struct Farmer {
        string name;
        string placeOfResidence;
        uint256 landOwned;
    }
    mapping(uint256 => Farmer) public farmerDetails;

    function addFarmer(
        string memory _name,
        string memory _placeOfResidence,
        uint256 _landOwned
    ) public {
        Farmer memory newFarmer =
            Farmer({
                name: _name,
                placeOfResidence: _placeOfResidence,
                landOwned: _landOwned
            });
        farmerDetails[farmerCount] = newFarmer;
        farmerCount += 1;
    }

    // get total number of farmers
    function getFarmerNumber() public view returns (uint256) {
        return farmerCount;
    }
}
