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
    address[] public unverifiedOfficials;

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

    function addGovOfficial(
        address _address,
        string memory _name,
        string memory _govId
    ) public {
        GovOfficial storage govOfficial = govOfficials[_address];
        govOfficial.name = _name;
        govOfficial.govId = _govId;
        govOfficialAccounts.push(_address);
    }

    function getOfficial(address _address)
        public
        view
        returns (string memory _name, string memory _govId)
    {
        return (govOfficials[_address].name, govOfficials[_address].govId);
    }

    function getUnverifiedOfficials() public returns (address[] memory) {
        delete unverifiedOfficials;
        uint256 i = 0;

        for (i = 0; i < govOfficialAccounts.length; i++) {
            if (rc.getRole(govOfficialAccounts[i]) == 0) {
                unverifiedOfficials.push(govOfficialAccounts[i]);
            }
        }

        return unverifiedOfficials;
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

    function setFarmerAsEligible(address _address)
        public
        OnlyGovernmentOfficial()
    {
        fc.setEligible(_address);
    }

    function verifyOfficial(address _address) public OnlyGovernmentOfficial() {
        rc.addRole(_address, rc.governmentOfficialRoleID());
    }
}
