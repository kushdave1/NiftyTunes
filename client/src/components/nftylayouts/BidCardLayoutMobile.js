import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Modal from 'react-bootstrap/Modal'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ToggleButton from 'react-bootstrap/ToggleButton'

import ButtonGroup from 'react-bootstrap/ButtonGroup';

import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'
import xicon from '../../assets/images/xicon.png'
import downarrow from '../../assets/images/downarrow4.png'
import failed from '../../assets/images/failed.png'
//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'

//Modals
import NFTModalNftyLive from '../nftyForms/NFTModalNftyLive'
import BidAcceptModal from '../nftyModals/BidModals/BidAcceptModal'
import BidLoadingModal from '../nftyModals/BidModals/BidLoadingModal'
import WithdrawLoadingModal from '../nftyModals/BidModals/WithdrawLoadingModal'
import SeeNFTsModal from '../nftyModals/SeeNFTsModal'

import BidAcceptModalMobile from '../nftyModals/BidModals/BidAcceptModalMobile'
import BidLoadingModalMobile from '../nftyModals/BidModals/BidLoadingModalMobile'
import WithdrawLoadingModalMobile from '../nftyModals/BidModals/WithdrawLoadingModalMobile'
import SeeNFTsModalMobile from '../nftyModals/SeeNFTsModalMobile'

// functions
import StartAuction from '../nftymarketplace/StartAuction'
// import { GetStarted } from '../nftyFunctions/GetStarted'

//solidity buttons
import BuyLazyNFTButton from '../nftySolidityButtons/BuyLazyNFTButton'
import BuyNFTButton from '../nftySolidityButtons/BuyNFTButton'
import ListNFTButton from '../nftySolidityButtons/ListNFTButton'
import DeListNFTButton from '../nftySolidityButtons/DeListNFTButton'
import StartAuctionButton from '../nftySolidityButtons/StartAuctionButton'
import EndAuctionButton from '../nftySolidityButtons/EndAuctionButton'
import UploadMetadataButton from '../nftySolidityButtons/UploadMetadataButton'
import BidLiveNFTButton from '../nftySolidityButtons/BidLiveNFTButton'

import legendaryseal from '../../assets/images/legendaryseal.png'
import legendaryband from '../../assets/images/legendaryband.png'

import { useNativeBalance } from "react-moralis";

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { BuyNFT } from "../nftymarketplace/BuyNFT"
import { useState, useEffect } from "react"
import img from "../../assets/images/ethereum.png"
import monkey from "../../assets/images/gorilla.png"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'
import { useMoralis, useNFTBalances } from "react-moralis"
import { WithdrawFunds } from "../nftyFunctions/WithdrawBid"

import { usePlaceBid } from "../../providers/PlaceBidProvider/PlaceBidProvider";


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"
import styled from "styled-components"

import nftyimg from "../../assets/images/NT_White_Isotype.png";

import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';


 
function BidCardMobile({auctionAddress, signerAddress, mintAddress, responsive, editionsPerAuction, tier, indexNumber, balance, auction}) {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const { isInitialized, isAuthenticated, user } = useMoralis()

  const [showBidModal, setShowBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

  const [userAddress, setUserAddress] = useState('')

  const [seeNFT, setSeeNFT] = useState(false)

  const handleSeeNFT = () => setSeeNFT(true)
  const handleCloseSeeNFT = () => setSeeNFT(false)

 

  const [auctionTime, setAuctionTime] = useState()
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
   
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")

  const [showWithdrawLoadingModal, setShowWithdrawLoadingModal] = useState(false)

  const { withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading,
     bidAmount, setBidAmount } = usePlaceBid()


  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const [currentBid, setCurrentBid] = useState()
  const [highestBid, setHighestBid] = useState()
  const [ifWinningBid, setIfWinningBid] = useState(false)
  const [lowestBid, setLowestBid] = useState()



  const GetStarted = async(auctionAddress, editionsPerAuction) => {

    let signer
    let liveAuctionFactory
    let liveAuctionFactoryContract

    if (isAuthenticated) {

      signer = await ConnectWallet()
      if (auctionAddress === "0xDDeB92CbB5A97C3C75FcA2f498BA3d3Ce8E5D429") {  
          liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)
      } else {
          liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)
      }
      

    } else {
        signer = GetProvider()
        if (auctionAddress === "0xDDeB92CbB5A97C3C75FcA2f498BA3d3Ce8E5D429") {  
            liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuctionProxy.abi, signer)
        } else {
            liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)
        }
        
    }

    let isStarted = ""

    try {
        isStarted = await liveAuctionFactoryContract.isStarted(mintAddress)
        console.log(isStarted, auctionAddress, "FORYOYU")
        setStarted(isStarted)
    } catch (e) {
        console.log(e)
    }

    let addresses=[]
    try{
        
        addresses = await liveAuctionFactoryContract.getTop(editionsPerAuction[0], mintAddress)
    } catch (e) {
        console.log(e)
    }

    let currBid = 0;
    let lowBid = 0;

    try {

        let cBid = await liveAuctionFactoryContract.getBid(mintAddress)
        
        let res = utils.formatEther(cBid);
        res = Math.round(res * 1e5) / 1e5;
        currBid = res

        
        setCurrentBid(currBid)
        
    } catch {
        setCurrentBid(0)
    }

    try {

        let highestBidPlaced = await liveAuctionFactoryContract.getHighestBid(mintAddress)
        let res = utils.formatEther(highestBidPlaced);
        console.log(res)
        res = Math.round(res * 1e5) / 1e5;
        let highBid = res
        setHighestBid(highBid)


    } catch (e) {
        setHighestBid(0)
    }

    try {
        let lowestBidPlaced = await liveAuctionFactoryContract.getLowestBid(mintAddress)
        
        let res = utils.formatEther(lowestBidPlaced);
        res = Math.round(res * 1e5) / 1e5;
        lowBid = res
        if (lowBid === highestBid) {
          console.log(lowBid, highestBid, "HEROS")
        }
        setLowestBid(lowBid)
    } catch {
        setLowestBid(0)
    }

    if (currBid >= lowBid) {
        console.log(currBid, lowBid, auctionAddress, "Mansta")
        if (currBid !== 0 ) {
            setIfWinningBid(true)
        } else {
            setIfWinningBid(false)
        }
    } else {
        console.log(currBid, lowBid, auctionAddress, "Mansta")
    }



    let endAt;
    try {
        endAt = await liveAuctionFactoryContract.getEndAt(mintAddress)
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














  const [showAuctionData, setShowAuctionData] = useState(false)

  const [displayedAuction, setDisplayedAuction] = useState("Auction")
  const [showDropdown, setShowDropdown] = useState(false)


  const handleShowAuctionData = () => setShowAuctionData(true)
  const handleCloseAuctionData = () => setShowAuctionData(false)

  const handleShowDropdown = () => setShowDropdown(true)
  const handleCloseDropdown = () => setShowDropdown(false)
  const toggleShowDropdown = () => setShowDropdown(p => !p)

  const handleShowBidModal = () => setShowBidModal(true)
  const handleCloseBidModal = () => setShowBidModal(false)

  const handleShowBidLoadingModal = () => setShowBidLoadingModal(true)
  const handleCloseBidLoadingModal = () => setShowBidLoadingModal(false)

  const handleShowWithdrawLoadingModal = () => setShowWithdrawLoadingModal(true)
  const handleCloseWithdrawLoadingModal = () => setShowWithdrawLoadingModal(false)
  

  useEffect(async() => {
      await showAuctionCardData(0, editionsPerAuction)
      
      console.log(currentBid, highestBid, lowestBid, auctionAddress, ifWinningBid, "POROWS")


      
      console.log(parseInt("00"))
  }, [])

  const PadWithZeros = (number) => {
      let paddedNumber = number
      if (parseInt(number) < 10) {
          const paddedNumber = ("0").concat(number)
      }
      return paddedNumber

  }

  


  const updateRemainingTime = async(countdown) => {


      const secondsLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000)
      const secondsLeft = secondsLeftInAuction % 60

      const minutesLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000/60)
      const minutesLeft = minutesLeftInAuction % 60

      const hoursLeft = Math.floor((new Date(countdown*1000) - new Date())/1000/60/60)
      setRemainingTime({
        seconds: secondsLeft.toString(),
        minutes: minutesLeft.toString(),
        hours: hoursLeft.toString()
      })
  


  }



  const showAuctionCardData = async(index, editions) => {
      setCurrentBid(0)
      setHighestBid(0)
      setLowestBid(0)
      
    
      const timeLeftIn = await GetStarted(auctionAddress, editions)
      const intervalId = setInterval(() => {
        
        updateRemainingTime(timeLeftIn)
      }, 1000)
      return () => clearInterval(intervalId)

  }

  const checkIfWinningBid = () => {
      if (currentBid >= lowestBid) {
          if (currentBid === 0 ) {
              setIfWinningBid(false)
          } else {
          setIfWinningBid(true)
        }
    } else {
        setIfWinningBid(false)
    }}

  
  const CardHeaderWithBidLegendary = () => {
    return (
      <CardHeaderWBid>
        <CardTitleWBid>
          {tier}
        </CardTitleWBid>
        <ITMWBid style={{left: tier === "Rare" ? "92px" : tier === "Legendary" ? "170px": "140px"}}>
          <ITMText>ITM</ITMText>
        </ITMWBid >
        <TopNFTs>
          <SeeNFTs onClick={()=>handleSeeNFT()}  >
            See NFTs
          </SeeNFTs>
        </TopNFTs>
      </CardHeaderWBid>
    )
  }

  const CardHeaderWithoutBidLegendary = () => {
    return (
      <CardHeaderWBid>
        <CardTitleWBid>
         {tier}
        </CardTitleWBid>
        <OTMWBid>
          <ITMText>OTM</ITMText>
        </OTMWBid>
        <TopNFTs>
          <SeeNFTs onClick={()=>handleSeeNFT()}  >
            See NFTs
          </SeeNFTs>
        </TopNFTs>
      </CardHeaderWBid>
    )
  }

  const BidTimeWithBid = () => {
    return (
      <BidTimeWBid>
                          <BidTimeBox>
                            <TimeLeft>
                              Time Left:
                            </TimeLeft>
                            <CalculatedTime>
                            {(remainingTime.seconds > -1 && `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` !== "00 : 00 : 00") ? (<>{remainingTime.hours} : {remainingTime.minutes} : {remainingTime.seconds}</>) :
                            (remainingTime.seconds < -1 && remainingTime.hours < -3000 || remainingTime.minutes < 0 && remainingTime.hours < -3000 || `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` === "00 : 00 : 00") ? (<div style={{fontSize: "10px"}}>Not Started</div>) :
                         (<div style={{fontSize: "10px"}}>Ended</div>)}
                            </CalculatedTime>
                          </BidTimeBox>
                        </BidTimeWBid>
    )
  }


  const BidTimeWithoutBid = () => {
    return (
      <BidTime>
                          <BidTimeBox>
                            <TimeLeft>
                              Time Left:
                            </TimeLeft>
                            <CalculatedTime>
                            {(remainingTime.seconds > -1 && `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` !== "00 : 00 : 00") ? (<>{remainingTime.hours} : {remainingTime.minutes} : {remainingTime.seconds}</>) :
                            (remainingTime.seconds < -1 && remainingTime.hours < -3000 || remainingTime.minutes < 0 && remainingTime.hours < -3000 || `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` === "00 : 00 : 00") ? (<div style={{fontSize: "10px"}}>Not Started</div>) :
                         (<div style={{fontSize: "10px"}}>Ended</div>)}
                            </CalculatedTime>
                          </BidTimeBox>
                        </BidTime>
    )
  }

  return (
    <>
       
        
                {
                (tier === "Legendary" && currentBid === highestBid && currentBid > 0 || tier !== "Legendary" && currentBid >= lowestBid && currentBid > 0) ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "330px", height: "230px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", background: tier === "Rare" ? "#FD4758" : tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"}}>
                    <CardSectionWBid>
                      <CardHeaderWithBidLegendary/>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                        <OutBidButton onClick={() => handleShowBidModal()}>
                          <BidButtonText>
                          Outbid
                          </BidButtonText>
                        </OutBidButton>
                        <WithdrawBidButton style={{background: tier === "Rare" ? "#FD4758" : tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                          <WithdrawBidText>
                            Withdraw Bid
                          </WithdrawBidText>
                        </WithdrawBidButton>
                        <BidTimeWithBid/>
                    
                      </BidBoxWBid>
                    </CardSectionWBid>
                  </Card>
                  
              ) : (currentBid > 0) ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "330px", height: "230px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", background: tier === "Rare" ? "#FD4758" : tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"}}>
                    <CardSectionWBid>
                      <CardHeaderWithoutBidLegendary/>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                        <OutBidButton onClick={() => handleShowBidModal()}>
                          <BidButtonText>
                          Outbid
                          </BidButtonText>
                        </OutBidButton>
                        <WithdrawBidButton style={{background: tier === "Rare" ? "#FD4758" : tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress)}}>
                          <WithdrawBidText>
                            Withdraw Bid
                          </WithdrawBidText>
                        </WithdrawBidButton>
                        <BidTimeWithBid/>
                    
                      </BidBoxWBid>
                    </CardSectionWBid>
                  </Card>
                ) 
              : (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "330px", height: "194px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", background: tier === "Rare" ? "#FD4758" : tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"}}>
                    <CardSection>
                      <CardHeader>
                      <CardTitle>
                        {tier}
                      </CardTitle>
                      <TopNFTs>
                        <TopBids>
                        Top {editionsPerAuction} Bids Win the NFT
                        </TopBids>
                        <SeeNFTs onClick={()=>handleSeeNFT()}  >
                          See NFTs
                        </SeeNFTs>
                      </TopNFTs>
                     </CardHeader>
                  <BidBox>
                  <BidButton onClick={() => handleShowBidModal()}>
                    <BidButtonText>
                    Place Bid
                    </BidButtonText>
                    </BidButton>
                    <BidTimeWithoutBid/>
                      
                  </BidBox>
                </CardSection>
                </Card>

              )
              
              
              }
           

     <BidAcceptModalMobile showBidModal={showBidModal} mintAddress={mintAddress} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid} highestBid={highestBid} lowestBid={lowestBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} tier={tier} auction={auction} auctionAddress={auctionAddress} editionsPerAuction={editionsPerAuction} balance={balance}/>
    
    <BidLoadingModalMobile showBidLoadingModal={showBidLoadingModal} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModalMobile showWithdrawLoadingModal={showWithdrawLoadingModal} 
    handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} auctionAddress={auctionAddress}/>

    <SeeNFTsModalMobile showBidModal={seeNFT} handleCloseBidModal={handleCloseSeeNFT} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress} editionsPerAuction={editionsPerAuction}
     tier={tier} auction={auction} mintAddress={mintAddress}/>


    </>
  )
}

export default BidCardMobile

const CardTitle = styled.div`
width: 152px;
height: 57px;
left: 0px;
top: 0px;

/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 40px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;
`

const CardTitleWBid = styled.div`
width: 152px;
height: 57px;
left: 0px;
top: 0px;

/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 40px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;
`

const ITMWBid = styled.div`

padding: 8px 8px 6px;
gap: 10px;
position: absolute;

width: 31px;
height: 22px;

/* green */

background: #11FB6E;
border-radius: 10px;
`

const OTMWBid = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 8px 8px 6px;
gap: 10px;

width: 37px;
height: 22px;

/* green */

background: #b30000;
border-radius: 10px;
`

const ITMText = styled.div`
width: 15px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */
white-space: nowrap;

text-align: center;
text-transform: uppercase;

/* black */

color: #000000;
`

const YourCurrentBid = styled.div`
width: 197px;
height: 24px;

/* text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 24px;
/* identical to box height, or 133% */
white-space: nowrap;

color: #000000;
`

const CardHeader = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-end;
padding: 0px;

width: 380px;
height: 47px;

`

const CardSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
width: 380px;
height: 109px;
`


const CardHeaderWBid = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-end;
padding: 0px;

width: 380px;
height: 57px;

`

const CardSectionWBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 380px;
height: 149px;

`


const TopNFTs = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 3px;
margin-left: 40px;

width: 189px;
height: 39px;

`

const TopBids = styled.div`
width: 189px;
height: 18px;

/* Caption small */
position: absolute;
left: 20px;
top: 80px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 0px;
/* identical to box height, or 112% */
text-transform: uppercase;

/* black */

color: #000000;
`

const SeeNFTs = styled.button`

width: 66px;
height: 18px;

display: flex;
flex-direction: column;
white-space: nowrap;
font-family: 'Inter';
font-style: normal;
font-weight: 400;
font-size: 13px;
line-height: 0px;
margin-left: 24px;
text-decoration-line: underline;
cursor: pointer;

z-index: 5;

border: none;
/* black */
background: transparent;
color: #000000;
`

const BidBox = styled.div`
width: 228px;
height: 44px;
`

const BidBoxWBid = styled.div`
width: 361px;
height: 44px;

`

const BidButton = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

position: absolute;
width: 123px;
height: 44px;
left: 20px;
top: 128px;
z-index: 1;
background: #000000;
border-radius: 30px;
`

const OutBidButton = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

position: absolute;
width: 123px;
height: 44px;
left: 20px;
top: 100px;
z-index: 1;
background: #000000;
border-radius: 30px;
`

const BidButtonText = styled.div`
width: 71px;
height: 16px;

/* button_text */
white-space: nowrap
font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 16px;
/* identical to box height */


color: #FFFFFF;
`

const BidTime = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 7px 16px 7px 59px;
gap: 10px;

position: absolute;
width: 168px;
height: 44px;
left: 84px;
top: 128px;
z-index: 0;

/* white_transparent */

background: rgba(255, 255, 255, 0.5);
border-radius: 20px;

`

const BidTimeWBid = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 7px 16px 7px 59px;
gap: 10px;

position: absolute;
width: 168px;
height: 44px;
left: 100px;
top: 154px;
z-index: 0;

/* white_transparent */

background: rgba(255, 255, 255, 0.5);
border-radius: 20px;

`

const WithdrawBidButton = styled.button`
box-sizing: border-box;
position: absolute;
/* Auto layout */

display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 14px 26px;
gap: 10px;

width: 145px;
height: 44px;
left: 20px;
top: 154px;

z-index: 1;

/* legendary */

/* white_transparent */

border: 2px solid rgba(255, 255, 255, 0.5);
border-radius: 30px;
`

const WithdrawBidText = styled.div`
width: 93px;
height: 16px;

/* button_text */

white-space: nowrap;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 16px;
/* identical to box height */

z-index: 1;
/* white_transparent */
`

const BidTimeBox = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
padding: 0px;
gap: 2px;
margin-left: 16px;
width: 73px;
height: 28px;
`

const TimeLeft = styled.div`
width: 42px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */

text-transform: uppercase;

color: #000000;
`

const CalculatedTime = styled.div`
width: 73px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 15px;
line-height: 18px;
/* identical to box height, or 112% */
white-space: nowrap;
text-transform: uppercase;

color: #000000;
`
