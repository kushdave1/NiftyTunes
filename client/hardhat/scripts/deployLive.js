const { ethers, network } = require("hardhat");

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

// 2. Collect list of wallet addresses from competition, raffle, etc.
// Store list of addresses in some data sheeet (Google Sheets or Excel


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');


  // We get the contract to deploy

  let contract_owner = await ethers.getSigner(network.config.from);
  console.log("Account balance:", (await contract_owner.getBalance()).toString());


  const LiveMint = await ethers.getContractFactory("LiveMintFactory");
  const liveMint = await LiveMint.deploy("NftyTunes", "NFTY", contract_owner.getAddress(), 5, 500);

  await liveMint.deployed();


  console.log("liveMint deployed to:", liveMint.address);
  

  const LiveAuction = await ethers.getContractFactory("LiveMintAuction");
  const liveAuction = await LiveAuction.deploy(liveMint.address);

  await liveAuction.deployed();

  console.log("liveAuction deployed to:", liveAuction.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });