var FarmerContract = artifacts.require("./FarmerContract.sol");
var GovContract = artifacts.require("./GovContract.sol");
var PolicyContract = artifacts.require("./PolicyContract.sol");
var Roles = artifacts.require("./Roles.sol");

module.exports = async function (deployer) {
  await deployer.deploy(Roles);

  await deployer.deploy(PolicyContract, Roles.address);

  await deployer
    .deploy(FarmerContract, Roles.address, PolicyContract.address)
    .then(function () {
      return deployer.deploy(GovContract, FarmerContract.address);
    });

  // deployer.deploy(Roles).then(function () {
  //   return deployer.deploy(FarmerContract, Roles.address).then(function () {
  //     return deployer.deploy(GovContract, FarmerContract.address);
  //   });
  // });
};
