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

import ButtonGroup from 'react-bootstrap/ButtonGroup';

import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'
import xicon from '../../assets/images/xicon.png'
import downarrow from '../../assets/images/downarrow4.png'
//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'

//Modals
import NFTModalNftyLive from '../nftyForms/NFTModalNftyLive'
import BidAcceptModal from '../nftyModals/BidModals/BidAcceptModal'
import BidLoadingModal from '../nftyModals/BidModals/BidLoadingModal'
import WithdrawLoadingModal from '../nftyModals/BidModals/WithdrawLoadingModal'

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
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { usePlaceBid } from "../../providers/PlaceBidProvider/PlaceBidProvider";
import { WithdrawFunds } from "../nftyFunctions/WithdrawBid"


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function BidCardMobile({auctionAddress, signerAddress, responsive, editionsPerAuction}) {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const [showBidModal, setShowBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

  const [auctionTime, setAuctionTime] = useState()
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)

  const { withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading,
    started, setStarted, ended, setEnded, currentBid, setCurrentBid, highestBid, setHighestBid, bidAmount, setBidAmount,
    ifWinningBid, setIfWinningBid, lowestBid, setLowestBid } = usePlaceBid()

   
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")


  const [showWithdrawLoadingModal, setShowWithdrawLoadingModal] = useState(false)


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
      
      await showAuctionCardData(0, editionsPerAuction[0])
      
  }, [])

  

  

  const updateRemainingTime = async(countdown) => {


      const secondsLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000)


      const secondsLeft = secondsLeftInAuction % 60
      const minutesLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000/60)
      const minutesLeft = minutesLeftInAuction % 60

      const hoursLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000/60/60)
      const hoursLeft = hoursLeftInAuction % 60
      const remaintime = {
        seconds: secondsLeft.toString(),
        minutes: minutesLeft.toString(),
        hours: hoursLeft.toString()
      }
      setRemainingTime({
        seconds: secondsLeft.toString(),
        minutes: minutesLeft.toString(),
        hours: hoursLeft.toString()
      })
  


  }

    

  const showAuctionCardData = async(index, editions) => {
      console.log(started, ended)
      setCurrentBid(0)
      setHighestBid(0)
      setLowestBid(0)
      setDisplayedAuction(`Auc. ${index} - ${editions} editions`)
      const timeLeftIn = await GetStarted(auctionAddress, started, setStarted, ended, setEnded, 
        currentBid, setCurrentBid, highestBid, setHighestBid, bidAmount, setBidAmount,
        ifWinningBid, setIfWinningBid, lowestBid, setLowestBid, editions)
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

  return (
    <>
       
        <Card className="bg-light shadow-sm"
              style={{ width: '24rem', height: '24rem', borderRadius:'.50rem',  fontSize: 10, overflow: "hidden", zIndex: "1"}} >
              
            
            <Card.Header>
            <Row>
                <Col>
                 
                <Button style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "black", float: "left"}}  
                    onClick={()=>{showAuctionCardData(0, editionsPerAuction[0]);checkIfWinningBid();}}>Refresh Bids</Button>
                    
                </Col>
                <Col>
                
                <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>
                        {(started && !ended) ? (<Card.Text> {remainingTime.hours} : {remainingTime.minutes} : {remainingTime.seconds}</Card.Text>) :
                          (ended) ? (<Card.Text>Ended</Card.Text>) :
                         (<Card.Text>Not Started</Card.Text>)}</Card.Title>
                </Col>
            </Row>
            </Card.Header>
            <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 14}}>Highest Bid: {highestBid} ETH</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Button style={{ color: "green", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "green"}} 
                    onClick={()=>handleShowBidModal()}>Outbid</Button>
                    </Col>
              </Row>
              <hr></hr>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 14}}>Lowest Winning Bid: {lowestBid} ETH</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Button style={{ color: "red", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "red"}} 
                    onClick={()=>handleShowBidModal()}>Outbid</Button>
                    </Col>
              </Row>
              <hr></hr>
              <Row className="d-flex flex-row" style={{flexDirection:"column", paddingBottom: "10px"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 14}}>Your Bid: {currentBid} ETH</Card.Title>
                        {(ifWinningBid) ? (<Card.Title className="truncate" style={{fontSize: 14, color: "green"}}>IN THE MONEY</Card.Title>) : (
                            <Card.Title className="truncate" style={{fontSize: 14, color: "red"}}>MUST BID MORE TO WIN AN NFT!</Card.Title>
                        )}
                    </Col>
                    <Col sm={4}>
                        {(ifWinningBid) ? (<></>) : (
                        <Button style={{ color: "red", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "red"}} 
                    onClick={()=>{handleShowWithdrawLoadingModal(); WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, 
                    setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress)}}>Withdraw</Button>
                    )}
                    </Col>
              </Row>
            
            </Card.Body>
              
        </Card>

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal}
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} 
    auctionAddress={auctionAddress}/>
   
        
      
    </>
  )
}

export default BidCardMobile