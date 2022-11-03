import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';

import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';




export const StartAuction = async(auctionTime, minBid, mintAddress, nfts, auctionAddress, setAuctionStarted, setStartError) => {

    
  const web3Modal = new Web3Modal({})
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)

  const minimumBid = ethers.utils.parseUnits(minBid, 'ether')
  console.log(mintAddress, "HOdL")
  let transaction = await liveAuctionFactoryContract.start(auctionTime, minimumBid, nfts, mintAddress)
  await transaction.wait()

  setAuctionStarted(true)


}

export default StartAuction;