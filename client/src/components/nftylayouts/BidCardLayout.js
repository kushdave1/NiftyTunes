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

// functions
import StartAuction from '../nftymarketplace/StartAuction'
import { GetStarted } from '../nftyFunctions/GetStarted'

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
import legendaryband from '../../assets/images/legendarybandlarge.gif'


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
import { WithdrawFunds } from "../nftyFunctions/WithdrawBid"
import { GetProvider } from '../nftyFunctions/GetProvider'

import { usePlaceBid } from "../../providers/PlaceBidProvider/PlaceBidProvider";
import { useMoralis, useNFTBalances } from "react-moralis"


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"
import styled from "styled-components"

import LiveMintAuctionProxy from '../../contracts/LiveMintFactoryWAuction.sol/LiveMintAuctionFactoryStorage.json';

import nftyimg from "../../assets/images/NT_White_Isotype.png";
import ProfileInfo from 'components/nftyModals/ProfileModals/ProfileInfo';


 
function BidCard({auctionAddress, signerAddress, mintAddress, responsive, editionsPerAuction, tier, indexNumber, balance, auction}) {

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
        setStarted(isStarted)
    } catch (e) {
        console.log(e)
    }

    let addresses=[]
    try{
        console.log(editionsPerAuction)
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
        console.log(lowBid, "FEAR")
        setLowestBid(lowBid)
    } catch {
        setLowestBid(0)
    }

    if (currBid >= lowBid) {
        if (currBid !== 0 ) {
            setIfWinningBid(true)
        } else {
            setIfWinningBid(false)
        }
    } else {
        setIfWinningBid(false)
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
      
    
      setDisplayedAuction(`Auc. ${index} - ${editions} editions`)
      const timeLeftIn = await GetStarted(auctionAddress, editions)
      console.log(timeLeftIn)
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
          Legendary
        </CardTitleWBid>
        <ITMWBid>
          <ITMText>ITM</ITMText>
        </ITMWBid>
        <TopNFTs>
          <TopBids>
          Top {editionsPerAuction} Bids Win the NFT
          </TopBids>
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
          Legendary
        </CardTitleWBid>
        <OTMWBid>
          <ITMText>OTM</ITMText>
        </OTMWBid>
        <TopNFTs>
          <TopBids>
          Top {editionsPerAuction} Bids Win the NFT
          </TopBids>
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
                            {(remainingTime.seconds > -1 && `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` !== "00 : 00 : 00") ? (<>{remainingTime.hours} : {remainingTime.minutes} : {(remainingTime.seconds < 10) ? (<>0{remainingTime.seconds}</>): (<>{remainingTime.seconds}</>)}</>) :
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
                            {(remainingTime.seconds > -1 && `${remainingTime.hours} : ${remainingTime.minutes} : ${remainingTime.seconds}` !== "00 : 00 : 00") ? (<>{remainingTime.hours} : {remainingTime.minutes} : {(remainingTime.seconds < 10) ? (<>0{remainingTime.seconds}</>): (<>{remainingTime.seconds}</>)}</>) :
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
                
                (tier === "Legendary") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundImage: `url(${legendaryband})`}}>
                    <CardSectionWBid>
                      <CardHeaderWithBidLegendary/>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                        <OutBidButton onClick={() => handleShowBidModal()}>
                          <BidButtonText>
                          Outbid
                          </BidButtonText>
                        </OutBidButton>
                        <WithdrawBidButton style={{background: `url(${legendaryband})`}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                          <WithdrawBidText>
                            Withdraw Bid
                          </WithdrawBidText>
                        </WithdrawBidButton>
                        <BidTimeWithBid/>
                    
                      </BidBoxWBid>
                    </CardSectionWBid>
          
                  </Card>
                ) : (tier === "Rare") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#FD4758"}}>
                    <CardSectionWBid>
                      <CardHeaderWBid>
                        <CardTitleWBid>
                          Rare
                        </CardTitleWBid>
                        <ITMWBid style={{marginLeft: "-150px"}}>
                          <ITMText>ITM</ITMText>
                        </ITMWBid>
                        <TopNFTs>
                          <TopBids>
                          Top {editionsPerAuction} Bids Win the NFT
                          </TopBids>
                          <SeeNFTs onClick={()=>handleSeeNFT()}  >
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                      </CardHeaderWBid>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowBidModal()}>
                    <BidButtonText>
                    Outbid
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#FD4758"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                      <WithdrawBidText>
                        Withdraw Bid
                      </WithdrawBidText>
                    </WithdrawBidButton>
                    <BidTimeWithBid/>
                  
                  </BidBoxWBid>
                </CardSectionWBid>

                </Card>
                ) : (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#EDCF92"}}>
                    <CardSectionWBid>
                      <CardHeaderWBid>
                        <CardTitleWBid>
                          Common
                        </CardTitleWBid>
                        <ITMWBid style={{marginLeft: "-50px"}}>
                          <ITMText>ITM</ITMText>
                      </ITMWBid>
                        <TopNFTs>
                          <TopBids>
                          Top {editionsPerAuction} Bids Win the NFT
                          </TopBids>
                          <SeeNFTs onClick={()=>handleSeeNFT()}  >
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                        
                    </CardHeaderWBid>
                    <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                    <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowBidModal()}>
                    <BidButtonText>
                    Outbid
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#EDCF92"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                      <WithdrawBidText>
                        Withdraw Bid
                      </WithdrawBidText>
                    </WithdrawBidButton>
                    <BidTimeWithBid/>
                  
                  </BidBoxWBid>
                </CardSectionWBid>
         
                </Card>
                )
              ) : (currentBid > 0.0) ? (
                (tier === "Legendary") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundImage: `url(${legendaryband})`}}>
                    <CardSectionWBid>
                      <CardHeaderWithoutBidLegendary/>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                        <OutBidButton onClick={() => handleShowBidModal()}>
                          <BidButtonText>
                          Outbid
                          </BidButtonText>
                        </OutBidButton>
                        <WithdrawBidButton style={{background: `url(${legendaryband})`}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                          <WithdrawBidText>
                            Withdraw Bid
                          </WithdrawBidText>
                        </WithdrawBidButton>
                        <BidTimeWithBid/>
                    
                      </BidBoxWBid>
                    </CardSectionWBid>
  
                  </Card>
                ) : (tier === "Rare") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#FD4758"}}>
                    <CardSectionWBid>
                      <CardHeaderWBid>
                        <CardTitleWBid>
                          Rare
                        </CardTitleWBid>
                        <OTMWBid style={{marginLeft: "-150px"}}>
                          <ITMText>OTM</ITMText>
                        </OTMWBid>
                        <TopNFTs>
                          <TopBids>
                          Top {editionsPerAuction} Bids Win the NFT
                          </TopBids>
                          <SeeNFTs onClick={()=>handleSeeNFT()}  >
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                      </CardHeaderWBid>
                      <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                      <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowBidModal()}>
                    <BidButtonText>
                    Outbid
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#FD4758"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                      <WithdrawBidText>
                        Withdraw Bid
                      </WithdrawBidText>
                    </WithdrawBidButton>
                    <BidTimeWithBid/>
                    

                  
                  </BidBoxWBid>
                </CardSectionWBid>
             
                </Card>
                ) : (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#EDCF92"}}>
                    <CardSectionWBid>
                      <CardHeaderWBid>
                        <CardTitleWBid>
                          Common
                        </CardTitleWBid>
                        <OTMWBid style={{marginLeft: "-50px"}}>
                          <ITMText>OTM</ITMText>
                      </OTMWBid>
                        <TopNFTs>
                          <TopBids>
                          Top {editionsPerAuction} Bids Win the NFT
                          </TopBids>
                          <SeeNFTs onClick={()=>handleSeeNFT()}  >
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                        
                    </CardHeaderWBid>
                    <YourCurrentBid>Your Current Bid is {currentBid} ETH</YourCurrentBid>
                    <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowBidModal()}>
                    <BidButtonText>
                    Outbid
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#EDCF92"}} onClick={()=>{handleShowWithdrawLoadingModal();
                        WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress, mintAddress)}}>
                      <WithdrawBidText>
                        Withdraw Bid
                      </WithdrawBidText>
                    </WithdrawBidButton>
                    <BidTimeWithBid/>
                  
                  </BidBoxWBid>
                </CardSectionWBid>

                </Card>
                )
              )
              
              : (

                (tier === "Legendary") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "141px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundImage: `url(${legendaryband})`}}>
                    <CardSection>
                      <CardHeader>
                      <CardTitle>
                        Legendary
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
                ) : (tier === "Rare") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "141px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#FD4758"}}>
                    <CardSection>
                      <CardHeader>
                        <CardTitle>
                          Rare
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
                ) : (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "141px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundColor: "#EDCF92"}}>
                    <CardSection>
                      <CardHeader>
                        <CardTitle>
                          Common
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

              )
              
              
              }
           

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid} highestBid={highestBid} lowestBid={lowestBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} tier={tier} auctionAddress={auctionAddress} mintAddress={mintAddress} 
     editionsPerAuction={editionsPerAuction} balance={balance} auction={auction}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} 
    handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} auctionAddress={auctionAddress}/>

    <SeeNFTsModal showBidModal={seeNFT} handleCloseBidModal={handleCloseSeeNFT} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} mintAddress={mintAddress} auctionAddress={auctionAddress} editionsPerAuction={editionsPerAuction}
     tier={tier} auction={auction}/>


    </>
  )
}

export default BidCard

const CardTitle = styled.div`
width: 152px;
height: 57px;
left: 0px;
top: 0px;

/* H5 */

font-family: 'Druk Cyr';

white-space: nowrap;

font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;
`

const CardTitleWBid = styled.div`
width: 152px;
height: 57px;
left: 0px;
top: 0px;

white-space: nowrap;

/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;
`

const ITMWBid = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 8px 8px 6px;
gap: 10px;

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
align-items: flex-end;
padding: 0px;
gap: 3px;
text-align: right;

width: 189px;
height: 39px;
`

const TopBids = styled.div`
width: 189px;
height: 18px;

/* Caption small */

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

font-family: 'Inter';
font-style: normal;
font-weight: 400;
font-size: 13px;
line-height: 0px;
text-decoration-line: underline;
white-space: nowrap;
cursor: pointer;

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
right: 275px;
top: 78px;
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
right: 275px;
top: 113px;
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
top: 78px;
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
left: 226px;
top: 114px;
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
left: 148px;
top: 114px;

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
