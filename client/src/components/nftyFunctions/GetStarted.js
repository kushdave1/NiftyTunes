import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from '../nftyFunctions/ConnectWallet'
import { ethers, utils } from 'ethers';

export const GetStarted = async(auctionAddress, started, setStarted, ended, setEnded, 
    currentBid, setCurrentBid, highestBid, setHighestBid, bidAmount, setBidAmount,
    ifWinningBid, setIfWinningBid, lowestBid, setLowestBid, editionsPerAuction) => {

    const signer = await ConnectWallet()

    const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
    const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

    let isStarted = ""

    try {
        isStarted = await liveAuctionFactoryContract.isStarted()
        console.log(isStarted)
        setStarted(isStarted)
    } catch (e) {
        console.log(e)
    }

    let addresses=[]
    try{
        
        addresses = await liveAuctionFactoryContract.getTop(editionsPerAuction[0])
    } catch (e) {
        console.log(e)
    }

    let currBid = 0;
    let lowBid = 0;

    try {

        let cBid = await liveAuctionFactoryContract.getBid()
        
        let res = utils.formatEther(cBid);
        res = Math.round(res * 1e5) / 1e5;
        currBid = res
        
        setCurrentBid(currBid)
        
    } catch {
        setCurrentBid(0)
    }

    try {

        let highestBidPlaced = await liveAuctionFactoryContract.getHighestBid()
        let res = utils.formatEther(highestBidPlaced);
        console.log(res)
        res = Math.round(res * 1e5) / 1e5;
        let highBid = res
        setHighestBid(highBid)
        console.log(highBid, "GANSTAG")

    } catch (e) {
        setHighestBid(0)
    }

    try {
        let lowestBidPlaced = await liveAuctionFactoryContract.getLowestBid()
        let res = utils.formatEther(lowestBidPlaced);
        res = Math.round(res * 1e5) / 1e5;
        lowBid = res
        setLowestBid(lowBid)
    } catch {
        setLowestBid(0)
    }

    if (currBid >= lowBid) {
        if (currBid === 0 ) {
            setIfWinningBid(false)
        } else {
            setIfWinningBid(true)
        }
    } else {
        setIfWinningBid(false)
    }


    let endAt;
    try {
        endAt = await liveAuctionFactoryContract.getEndAt()
    } catch {
        console.log("endAt")
    }

    const secondsLeftInAuction = Math.floor((new Date(endAt.toNumber()*1000) - new Date())/1000)

    if (secondsLeftInAuction < 0 && endAt.toNumber() !== 0) {
        setEnded(true)
    } else {
        setEnded(false)
    }
    
    return endAt.toNumber()

} 