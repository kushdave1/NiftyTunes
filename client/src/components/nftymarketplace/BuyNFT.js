import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";



export const BuyNFT = async(nft, marketAddress, marketContractABI) => {

    
  const contractABIJson = JSON.parse(marketContractABI);
  const web3Modal = new Web3Modal({})
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  
  const price = ethers.utils.parseUnits(nft.price, 'ether')

  const marketplaceContract = new ethers.Contract(marketAddress, contractABIJson, signer)
  console.log(nft)
  
  let transaction = await marketplaceContract.createMarketSale(nft.tokenId)
  console.log('success for sure')

}

export default BuyNFT;
