import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";



export const BuyNFT = async(nft, marketAddress, contractABIJson) => {

    
  const web3Modal = new Web3Modal({})
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  
  const price = ethers.utils.parseUnits(nft.price, 'ether')

  const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
  console.log(price)
  
  let transaction = await marketplaceContract.createMarketSale(nft.tokenId, {value: price})
  console.log('success for sure')

  const query = new Moralis.Query('ListedNFTs')

  query.equalTo('tokenURI', nft.tokenURI)
  const object = await query.first() // just get 1 item, not array of items


  object.addUnique("buyerAddress", signer.getAddress())
  object.addUnique("pricePurchased", nft.price)

  object.save()

}

export default BuyNFT;
