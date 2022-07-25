import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralis, useNFTBalances, useERC20Balances } from "react-moralis";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';




export const StartAuction = async(auctionTime, auctionAddress, setAuctionStarted, setStartError) => {

    
  const web3Modal = new Web3Modal({})
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

  const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
  let transaction = await liveAuctionFactoryContract.start(auctionTime)
  await transaction.wait()

  setAuctionStarted(true)


}

export default StartAuction;