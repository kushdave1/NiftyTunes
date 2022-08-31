import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { ethers, utils } from 'ethers';

export const WithdrawFunds = async(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress) => {
      setWithdrawError(false)
      setWithdrawSuccess(false)
      setWithdrawLoading(true)
      
      const signer = await ConnectWallet()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
      
      let transaction

      try {
          transaction = await liveAuctionFactoryContract.withdraw()
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