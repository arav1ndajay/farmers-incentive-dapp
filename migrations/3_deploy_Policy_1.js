var Policy_1 = artifacts.require("./Policy_1.sol");
var FarmerContract = artifacts.require("./FarmerContract.sol");

module.exports = function(deployer) {
  deployer.deploy(Policy_1, FarmerContract.address);
};

