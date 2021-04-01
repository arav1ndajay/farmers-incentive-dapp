pragma solidity >=0.4.21;
import "./Roles.sol";
import "./FarmerContract.sol";

contract GovContract {
    Roles public rc;
    FarmerContract public fc;

    constructor(address _rcAddress, address _fcAddress) public {
        rc = Roles(_rcAddress);
        fc = FarmerContract(_fcAddress);
    }

    struct GovOfficial {
        string name;
        string govId;
    }

    mapping(address => GovOfficial) public govOfficials;
    address[] public govOfficialAccounts;

    function addGovOfficial(
        address _address,
        string memory _name,
        string memory _govId
    ) public {
        GovOfficial storage govOfficial = govOfficials[_address];
        govOfficial.name = _name;
        govOfficial.govId = _govId;

        govOfficialAccounts.push(_address);

        rc.addRole(_address, rc.governmentOfficialRoleID());
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
