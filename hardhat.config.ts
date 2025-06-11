require("@nomicfoundation/hardhat-toolbox");
require('hardhat-gas-reporter');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      },
    },
  },
  defaultNetwork: 'hardhat',

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
      chainId: 1337,
    },
    // bsctest: {
    //   url : "https://data-seed-prebsc-1-s1.binance.org:8545/",
    //   accounts: [process.env.PRIV_KEY]
    // },
    eth_mumbai: {
      url: process.env.ALCHEMY_API_URL || "https://eth-sepolia.g.alchemy.com/v2/6e8TIcwlmMm_FZLknMK6hg-zvrDi5iBt",
      accounts: [
        `0x`+ (process.env.PRIVATE_KEY || "5d359705d67b1674b513075729b6474fd921f32ffb0bddf0492f43e8f756dcc6")
      ],
      gasPrice: 10000000000,
      gas: 3000000,
    }
  },
  etherscan: {
    url: "https://api.etherscan.io/api",
    apiKey: process.env.ETHERSCAN_API_KEY
  },
};
