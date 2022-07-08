// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
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
  console.log(contract_owner);


  const WETH = await ethers.getContractFactory("WETH10");
  const weth = await WETH.deploy();

  await weth.deployed();


  console.log("weth deployed to:", weth.address);
  

  const NFTMarketplaceStorage = await ethers.getContractFactory("NFTMarketplaceStorage");
  const marketplaceStorage = await NFTMarketplaceStorage.deploy(weth.address);

  await marketplaceStorage.deployed();


  console.log("storage deployed to:", marketplaceStorage.address);
  

  const NFTMarket = await ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarket.deploy(marketplaceStorage.address, weth.address);

  await nftMarket.deployed();

  await marketplaceStorage.transferOwnership(nftMarket.address);

  const marketOwner = await marketplaceStorage.owner();

  console.log("marketplace deployed to:", nftMarket.address);
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();
  console.log("nft deployed to: ", nft.address);

  let whitelistAddresses = [
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" // The address in remix
  ];

  const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
  const buf2hex = (x) => {
    const hex = '0x' + x.toString('hex');
    return hex;
  }
  const rootHash = merkleTree.getRoot();

  const Collection = await ethers.getContractFactory("Collection");
  const collection = await Collection.deploy(rootHash);

  await collection.deployed();

  console.log("collection deployed to:", collection.address);

  // const Tunes = await ethers.getContractFactory("TUNES");
  // const tunes = await Collection.deploy();

  // await tunes.deployed();

  // console.log("collection deployed to:", tunes.address);

  // const hexProof = merkleTree.getHexProof(leafNodes[1]);
  // console.log(hexProof);

  // // ✅ - ❌: Verify is claiming address is in the merkle tree or not.
  // // This would be implemented in your Solidity Smart Contract
  // console.log(merkleTree.verify(hexProof, leafNodes[1], rootHash));
  const Staking = await ethers.getContractFactory("NFTStaking");
  const staking = await Staking.deploy(collection.address, weth.address);

  await staking.deployed();

  console.log("staking deployed to:", staking.address);

  



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
