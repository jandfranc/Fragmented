const NFTFragmenter = artifacts.require('NFTFragmenter');

module.exports = function (deployer) {
    deployer.deploy(NFTFragmenter);
};
