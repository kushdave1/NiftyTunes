import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { ethers, utils } from 'ethers';
import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';

export const PlaceBid = async(bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading, bidAmount, auctionAddress, mintAddress) => {
      console.log("WHERY")
      setBidLoading(true)
      setBidError(false)
      setBidSuccess(false)
      
      const signer = await ConnectWallet()

      console.log(auctionAddress, mintAddress, "KESEL")

      const liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)

      let lastBid = 0;
      try {
        lastBid = await liveAuctionFactoryContract.getBid(mintAddress)
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
          transaction = await liveAuctionFactoryContract.bid(mintAddress, {value: price})
          await transaction.wait()
          setBidLoading(false)
         
      } catch (error) {
        
          setBidLoading(false)
          setBidError(true)
          return
      }

      setBidSuccess(true)
  }