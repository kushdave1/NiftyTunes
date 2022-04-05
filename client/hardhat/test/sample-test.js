const { expect } = require("chai");
const { ethers } = require("hardhat");
const { LazyMinter } = require('../lib')

async function deploy() {
  const [minter, redeemer, _] = await ethers.getSigners()

  let factory = await ethers.getContractFactory("LazyNFT", minter)
  const contract = await factory.deploy(minter.address)

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = factory.connect(redeemer)
  const redeemerContract = redeemerFactory.attach(contract.address)

  return {
    minter,
    redeemer,
    contract,
    redeemerContract,
  }
}


describe("NFTMarketplace", function() {

  // it("Should deploy", async function() {
  //   const signers = await ethers.getSigners();
  //   const minter = signers[0].address;

  //   const LazyNFT = await ethers.getContractFactory("LazyNFT");
  //   const lazynft = await LazyNFT.deploy(minter);
  //   await lazynft.deployed();

  // });

  // it("Should redeem an NFT from a signed voucher", async function() {
  //   const { contract, redeemerContract, redeemer, minter } = await deploy()

  //   const lazyMinter = new LazyMinter({ contractAddress: contract.address, signer: minter })
  //   const { voucher, signature } = await lazyMinter.createVoucher(1, "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi")

  //   await expect(redeemerContract.redeem(redeemer.address, voucher, signature))
  //     .to.emit(contract, 'Transfer')  // transfer from null address to minter
  //     .withArgs('0x0000000000000000000000000000000000000000', minter.address, voucher.tokenId)
  //     .and.to.emit(contract, 'Transfer') // transfer from minter to redeemer
  //     .withArgs(minter.address, redeemer.address, voucher.tokenId);
  // });

  
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplaceR = await NFTMarketplace.deploy()
    await nftMarketplaceR.deployed()

    let listingPrice = await nftMarketplaceR.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('0.01', 'ether')
    const royalties = ethers.utils.parseUnits('5', 'wei')
    console.log(royalties)
    /* create two tokens */
    await nftMarketplaceR.createToken("https://www.mytokenlocation.com", auctionPrice, royalties, { value: listingPrice })
    await nftMarketplaceR.createToken("https://www.mytokenlocation2.com", auctionPrice, royalties, { value: listingPrice })
      
    const [_, buyerAddress] = await ethers.getSigners()
  
    /* execute sale of token to another user */
    await nftMarketplaceR.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    /* resell a token */
    await nftMarketplaceR.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    items = await nftMarketplaceR.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplaceR.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})