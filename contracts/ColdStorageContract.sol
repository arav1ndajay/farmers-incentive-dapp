// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;

contract ColdStorageContract {
    struct ColdStorage {
        string ownerName;
        string location;
        uint256 capacity;
        address ownerAddress;
        address[] tenants;
    }

    mapping(uint256 => ColdStorage) public coldStorages;
    uint256[] public coldStorageIDs;

    function addColdStorage(
        uint256 _id,
        string memory _ownerName,
        string memory _location,
        uint256 _capacity,
        address _ownerAddress
    ) public {
        ColdStorage storage coldStorage = coldStorages[_id];
        coldStorage.ownerName = _ownerName;
        coldStorage.location = _location;
        coldStorage.capacity = _capacity;
        coldStorage.ownerAddress = _ownerAddress;
        coldStorageIDs.push(_id);
    }

    function getColdStorageIDs() public view returns (uint256[] memory) {
        return coldStorageIDs;
    }

    function getColdStorage(uint256 _id)
        public
        view
        returns (
            string memory _ownerName,
            string memory _location,
            uint256 _capacity,
            address _ownerAddress
        )
    {
        return (
            coldStorages[_id].ownerName,
            coldStorages[_id].location,
            coldStorages[_id].capacity,
            coldStorages[_id].ownerAddress
        );
    }

    function countColdStorages() public view returns (uint256) {
        return coldStorageIDs.length;
    }
}
