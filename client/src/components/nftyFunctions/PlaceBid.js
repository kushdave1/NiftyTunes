import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { ethers, utils } from 'ethers';

export const PlaceBid = async(bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading, bidAmount, auctionAddress) => {
      setBidLoading(true)
      setBidError(false)
      setBidSuccess(false)
      
      const signer = await ConnectWallet()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

      let lastBid = 0;
      try {
        lastBid = await liveAuctionFactoryContract.getBid()
        lastBid = lastBid.toNumber()
      } catch (e) {
        console.log(e)  
      }
      
      let currentBid
      try {
          currentBid = ethers.utils.parseUnits(bidAmount.toString(), 'ether')
      } catch {
          currentBid = 0
          setBidLoading(false)
          setBidError(true)
      }
      
      let transaction; 

      try {
          let price = currentBid.sub(lastBid)
          transaction = await liveAuctionFactoryContract.bid({value: price})
          await transaction.wait()
          setBidLoading(false)
         
      } catch (error) {
        
          setBidLoading(false)
          setBidError(true)
          return
      }

      setBidSuccess(true)
  }