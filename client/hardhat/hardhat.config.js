require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
let secret = require("./secret");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY.toString();

console.log(API_URL, PRIVATE_KEY);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "goerli",
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 1337
    },
    rinkeby: {
      url: API_URL,
      chainId: 4,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: API_URL,
      chainId: 5,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  }
};
