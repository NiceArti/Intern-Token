const InternToken = artifacts.require("./InternToken.sol");

module.exports = function (deployer) {
  deployer.deploy(InternToken, 123123);
};
