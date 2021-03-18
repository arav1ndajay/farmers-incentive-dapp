var FarmerContract = artifacts.require("./FarmerContract.sol");

module.exports = function (deployer) {
  deployer.deploy(FarmerContract);
};
