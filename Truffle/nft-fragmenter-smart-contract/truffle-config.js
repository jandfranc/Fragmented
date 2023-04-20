const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');

dotenv.config();

const { PRIVATE_KEY, INFURA_PROJECT_ID, POLYGON_RPC_URL } = process.env;

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
    },
    ropsten: {
      provider: () => new HDWalletProvider([PRIVATE_KEY], `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 3,
      gas: 5500000,
    },
    goerli: {
      provider: () => new HDWalletProvider([PRIVATE_KEY], `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 5,
      gas: 5500000,
    },
    mumbai: {
      provider: () => new HDWalletProvider([PRIVATE_KEY], POLYGON_RPC_URL),
      network_id: 80001,
      gas: 5500000,
    },
    // Add other networks if necessary
  },

  compilers: {
    solc: {
      version: '0.8.4', // Specify the Solidity version you are using
    },
  },
};
