var Policy_1 = artifacts.require("./Policy_1.sol");
var Policy_2 = artifacts.require("./Policy_2.sol");
var FarmerContract = artifacts.require("./FarmerContract.sol");

module.exports = function (deployer) {
  deployer.deploy(Policy_1, FarmerContract.address);
  deployer.deploy(Policy_2, FarmerContract.address);
};
