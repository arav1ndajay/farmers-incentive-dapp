var FarmerContract = artifacts.require("./FarmerContract.sol");
var GovContract = artifacts.require("./GovContract.sol");
var Roles = artifacts.require("./Roles.sol");
var ColdStorageContract = artifacts.require("./ColdStorageContract.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Roles);

  await deployer.deploy(ColdStorageContract);

  await deployer
    .deploy(FarmerContract, Roles.address)
    .then(function () {
      return deployer.deploy(
        GovContract,
        Roles.address,
        FarmerContract.address
      );
    });

};
