// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21;

contract Roles {
    uint256 public constant farmerRoleID = 1;
    uint256 public constant governmentOfficialRoleID = 2;
    uint256 public constant policyMakerRoleID = 3;
    struct Role {
        uint256 roleID;
        bool roleSet;
    }

    mapping(address => Role) role;

    function addRole(address _address, uint256 _RoleID) public {
        role[_address] = Role(_RoleID, true);
    }

    function getRole(address _address) public view returns (uint256) {
        return role[_address].roleID;
    }
}
