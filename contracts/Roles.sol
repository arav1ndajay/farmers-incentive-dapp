// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21;

contract Roles {
    uint256 public constant farmerRoleID = 1;
    uint256 public constant governmentOfficialRoleID = 2;
    uint256 public constant adminRoleID = 3;

    struct Role {
        uint256 roleID;
        bool roleSet;
    }

    constructor() public {
        role[tx.origin] = Role(adminRoleID, true);
    }

    mapping(address => Role) role;

    modifier OnlyGovernmentOfficial() {
        require(
            ((role[tx.origin].roleID == governmentOfficialRoleID) ||
                role[tx.origin].roleID == adminRoleID),
            "Only government official or admin"
        );

        _;
    }

    modifier OnlyAdmin() {
        require((role[tx.origin].roleID == adminRoleID), "Only admin");

        _;
    }

    function addRole(address _address, uint256 _RoleID)
        public
        OnlyGovernmentOfficial()
    {
        if (role[_address].roleSet == false)
            role[_address] = Role(_RoleID, true);
    }

    function getRole(address _address) public view returns (uint256) {
        if (role[_address].roleSet == true) return role[_address].roleID;
        else return 0;
    }

    function deleteRole(address _address, uint256 _RoleID) public OnlyAdmin() {
        role[_address].roleSet = false;
        role[_address].roleID = 0;
    }
}
