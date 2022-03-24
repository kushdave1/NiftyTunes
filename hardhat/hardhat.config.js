require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337
    },
    rinkeby: {
      "url": "https://speedy-nodes-nyc.moralis.io/74878254dc8b75a1334e9afe/eth/rinkeby",
      "accounts": ["4d555c67610b10d52454f369638ac2846fb2343d8d81a607661fc40784ec9d69"]
    }
  },
  solidity: "0.8.4",
  etherscan: {
    apiKey: "PU6T9A9XD1S8JHWG1UCZG5I8JNZRKT64HV"
  }
};
