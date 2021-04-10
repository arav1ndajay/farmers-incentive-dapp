// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.21;

contract ColdStorageContract {
    struct ColdStorage {
        string ownerName;
        string location;
        uint256 capacity;
        uint256 price;
        address ownerAddress;
        address[] requests;
        address[] tenants;
    }

    mapping(uint256 => ColdStorage) public coldStorages;
    uint256[] public coldStorageIDs;

    function addColdStorage(
        uint256 _id,
        string memory _ownerName,
        string memory _location,
        uint256 _capacity,
        uint256 _price,
        address _ownerAddress
    ) public {
        ColdStorage storage coldStorage = coldStorages[_id];
        coldStorage.ownerName = _ownerName;
        coldStorage.location = _location;
        coldStorage.capacity = _capacity;
        coldStorage.price = _price * 10**18;
        coldStorage.ownerAddress = _ownerAddress;
        coldStorageIDs.push(_id);
    }

    function getColdStorageIDs() public view returns (uint256[] memory) {
        return coldStorageIDs;
    }

    function getRequests(uint256 _id) public view returns (address[] memory) {
        require(msg.sender == coldStorages[_id].ownerAddress);

        return coldStorages[_id].requests;
    }

    function getCSrequested(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory CSIDs = new uint256[](coldStorageIDs.length);
        uint256 pointer = 0;
        //loop to traverse through cold storages
        for (uint256 i = 0; i < coldStorageIDs.length; i++) {
            for (
                uint256 j = 0;
                j < coldStorages[coldStorageIDs[i]].requests.length;
                j++
            ) {
                if (coldStorages[coldStorageIDs[i]].requests[j] == _address) {
                    CSIDs[pointer] = coldStorageIDs[i];
                    pointer++;
                    break;
                }
            }
        }
        return CSIDs;
    }

    function getColdStorage(uint256 _id)
        public
        view
        returns (
            string memory _ownerName,
            string memory _location,
            uint256 _capacity,
            uint256 _price,
            address _ownerAddress
        )
    {
        return (
            coldStorages[_id].ownerName,
            coldStorages[_id].location,
            coldStorages[_id].capacity,
            coldStorages[_id].price,
            coldStorages[_id].ownerAddress
        );
    }

    function countColdStorages() public view returns (uint256) {
        return coldStorageIDs.length;
    }

    function requestColdStorage(uint256 _id) public {
        if (address(msg.sender).balance >= coldStorages[_id].price) {
            coldStorages[_id].requests.push(address(msg.sender));
        }
    }

    function removeRequest(address _address, uint256 _id) public {
        address[] storage reqs = coldStorages[_id].requests;

        bool isPresent = false;
        uint256 reqIndex = 0;

        for (uint256 i = 0; i < reqs.length; i++) {
            if (reqs[i] == _address) {
                isPresent = true;
                reqIndex = i;
                break;
            }
        }

        if (isPresent) {
            for (uint256 i = reqIndex; i < reqs.length - 1; i++) {
                reqs[i] = reqs[i + 1];
            }

            delete reqs[reqs.length - 1];
            coldStorages[_id].requests = reqs;
            coldStorages[_id].requests.pop();
        } else return;
    }

    function rentColdStorage(uint256 _id, address _address) public {
        require(msg.sender == coldStorages[_id].ownerAddress);

        coldStorages[_id].tenants.push(_address);
        removeRequest(_address, _id);
    }

    function getTenants(uint256 _id) public view returns (address[] memory) {
        require(msg.sender == coldStorages[_id].ownerAddress);

        return coldStorages[_id].tenants;
    }
}
