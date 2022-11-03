import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';

import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';

import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { ethers, utils } from 'ethers';

export const WithdrawFunds = async(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress) => {
      console.log(mintAddress, "YOUP")
      setWithdrawError(false)
      setWithdrawSuccess(false)
      setWithdrawLoading(true)

      
      
      const signer = await ConnectWallet()

      const liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)

      
      
      let transaction

      try {
          transaction = await liveAuctionFactoryContract.withdraw(mintAddress)
          await transaction.wait()
          setWithdrawLoading(false)
         
      } catch (error) {
          console.log(error)
          setWithdrawLoading(false)
          setWithdrawError(true)
          return
      }

      setWithdrawSuccess(true)
  }