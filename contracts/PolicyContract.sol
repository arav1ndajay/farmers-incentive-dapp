// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;
import "./Roles.sol";

contract PolicyContract {
    Roles public rc;

    constructor(address _address) public {
        rc = Roles(_address);
    }

    struct Policy {
        uint256 policyId;
        uint256 maxLandReq;
        string gender;
        string stateOfResidence;
    }

    mapping(uint256 => Policy) public policies;
    uint256[] public policyDetails;

    function addPolicy(
        uint256 _policyId,
        uint256 _maxLandReq,
        string memory _gender,
        string memory _stateOfResidence
    ) public payable {
        Policy storage policy = policies[_policyId];
        policy.maxLandReq = _maxLandReq;
        policy.gender = _gender;
        policy.stateOfResidence = _stateOfResidence;

        policyDetails.push(_policyId);

        //rc.addRole(_address, rc.farmerRoleID());
    }

    function getPolicies() public view returns (uint256[] memory) {
        return policyDetails;
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
        return (
            policies[_policyId].maxLandReq,
            policies[_policyId].gender,
            policies[_policyId].stateOfResidence
        );
    }

    function countPolicies() public view returns (uint256) {
        return policyDetails.length;
    }
}
