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


  // const LiveMint = await ethers.getContractFactory("LiveMintFactory");
  // const liveMint = await LiveMint.deploy(
    

  // );

  // await liveMint.deployed();

  // console.log(liveMint.address)

  

  
  const LiveAuction = await ethers.getContractFactory("LiveMintAuctionFactoryStorage");
  const liveAuction = await LiveAuction.deploy(); 

  await liveAuction.deployed();

  console.log("liveAuction deployed to:", liveAuction.address);

  

  const LiveMintProxy = await ethers.getContractFactory("MintFactoryClone");
  const liveMintProxy = await LiveMintProxy.deploy("0xe35891c6914029e7D2256668bc4EF20ddF699CC4");

  await liveMintProxy.deployed();


  console.log("Proxy deployed to", liveMintProxy.address)

  // // const LiveAuctionProxy = await ethers.getContractFactory("AuctionFactoryClone");
  // // const liveAuctionProxy = await LiveAuctionProxy.deploy(liveAuction.address);

  // // await liveAuctionProxy.deployed();

  // // console.log(liveAuctionProxy.address)

  let transaction
  let completed
  

  // transaction = await liveMintProxy.createERC721Token("Freedia Legendary", "FMFBF", liveAuction.address, 1, 500)
  // completed = await transaction.wait()
  // let mintProxyLegendary = completed['events'][1]['args'][0]


  // transaction = await liveMintProxy.createERC721Token("Freedia Rare", "FMFBF", liveAuction.address, 2, 500)
  // completed = await transaction.wait()
  // let mintProxyRare = completed['events'][1]['args'][0]

  // transaction = await liveMintProxy.createERC721Token("Freedia Common", "FMFBF", liveAuction.address, 3, 500)
  // completed = await transaction.wait()
  // let mintProxy = completed['events'][1]['args'][0]

  // transaction = await liveAuction.setupAuction(mintProxyLegendary,
  // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  // mintProxyLegendary,
  // mintProxyLegendary,
  // 5,
  // 50,
  // 45)

  // completed = await transaction.wait()

  // transaction = await liveAuction.setupAuction(mintProxyRare,
  // "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  // mintProxyRare,
  // mintProxyRare,
  // 5,
  // 50,
  // 45)

  // completed = await transaction.wait()

  // transaction = await liveAuction.setupAuction(mintProxy,
  // mintProxy,
  // mintProxy,
  // mintProxy,
  // 5,
  // 50,
  // 45)

  console.log(mintProxyLegendary, liveAuction.address, "LEGENDAR")
  console.log(mintProxyRare, liveAuction.address, "RARE")
  console.log(mintProxy, liveAuction.address, "COMMON")

  // const minimumBid = ethers.utils.parseUnits("0.01", 'ether')

  // transaction = await liveAuction.start(1, minimumBid, 1, mintProxyLegendary)
  

  // completed = await transaction.wait()

  // transaction = await liveAuction.bid(mintProxyLegendary, {value: minimumBid})




  // completed = await transaction.wait()



  // console.log(completed['events'][0]['args'])

  // transaction = await liveAuction.start(1, minimumBid, 1, mintProxyRare)
  

  // completed = await transaction.wait()


  // transaction = await liveAuction.bid(mintProxyLegendary, {value: minimumBid})



  // completed = await transaction.wait()


  // transaction = await liveAuction.bid(mintProxyRare, {value: minimumBid})



  // completed = await transaction.wait()

  // console.log(completed)
      


  console.log("Account balance:", (await contract_owner.getBalance()).toString());

  // const sleep = ms => new Promise(r => setTimeout(r, ms));



  // transaction = await liveAuction.getEndAt(mintProxyLegendary)

  // transaction = await liveAuction.end(["ipfs/adofonadoifnasoidnsa"], mintProxyLegendary)



  // completed = await transaction.wait()

  // transaction = await liveAuction.end(["ipfs/adofonadoifnasoidnflpfsa"], mintProxyRare)

  // completed = await transaction.wait()

  console.log("Account balance:", (await contract_owner.getBalance()).toString());





  

  // let testMint = LiveMint.attach(completed['events'][1]['args'][0])
  // let tx = await testMint.transferOwnership("0x0fE9fE5F571424e18B60D2Ba72Fd73e48209E9Fd")
  // await tx.wait()

  // await liveMintProxy.createAuction("Hubba", "HUB", contract_owner.getAddress(), 3, 500)




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });