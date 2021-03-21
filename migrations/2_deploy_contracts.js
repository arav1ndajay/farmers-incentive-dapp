var FarmerContract = artifacts.require("./FarmerContract.sol");
var GovContract = artifacts.require("./GovContract.sol");
module.exports = function (deployer) {
  deployer.deploy(FarmerContract).then(function () {
    return deployer.deploy(GovContract, FarmerContract.address);
  });
};
