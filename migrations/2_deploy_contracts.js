var FarmerContract = artifacts.require("./FarmerContract.sol");
var GovContract = artifacts.require("./GovContract.sol");
var Roles = artifacts.require("./Roles.sol");

module.exports = function (deployer) {
  deployer.deploy(Roles).then(function ()
  {

    return deployer.deploy(FarmerContract, Roles.address).then(function () 
    {
      return deployer.deploy(GovContract, FarmerContract.address);
    }
    );
  }
  )
};
