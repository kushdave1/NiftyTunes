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
import Alert from 'react-bootstrap/Alert'

import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'

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
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';



import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function ProductCardsLayoutLiveMobile({index, owner, ownerName, artistName, artist, artistPhoto, collection, image, coverArt, name, 
description, nft, auctionAddress, editionsPerAuction, sold, fileType}) 

  {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const [showBidModal, setShowBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false) 

  const [currentBid, setCurrentBid] = useState()
  const [bidAmount, setBidAmount] = useState()

  const [auctionTime, setAuctionTime] = useState()
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
  
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")

  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidLoading, setBidLoading] = useState(true)
  const [bidError, setBidError] = useState(false)

  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(true)
  const [withdrawError, setWithdrawError] = useState(false)
  const [showWithdrawLoadingModal, setShowWithdrawLoadingModal] = useState(false)


  const handleShowBidModal = () => setShowBidModal(true)
  const handleCloseBidModal = () => setShowBidModal(false)

  const handleShowBidLoadingModal = () => setShowBidLoadingModal(true)
  const handleCloseBidLoadingModal = () => setShowBidLoadingModal(false)

  const handleShowWithdrawLoadingModal = () => setShowWithdrawLoadingModal(true)
  const handleCloseWithdrawLoadingModal = () => setShowWithdrawLoadingModal(false)

  

  useEffect(async() => {
      console.log(fileType, "BIGSHTUFF")
      const timeLeftIn = await getStarted()

      const intervalId = setInterval(() => {
        updateRemainingTime(timeLeftIn)
      }, 1000)
      return () => clearInterval(intervalId)
    
      console.log(parseInt("00"))
  }, [])

  

  const updateRemainingTime = async(countdown) => {


      const secondsLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000)


      const secondsLeft = secondsLeftInAuction % 60
      const minutesLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000/60)
      const minutesLeft = minutesLeftInAuction % 60

      const hoursLeft = Math.floor((new Date(countdown*1000) - new Date())/1000/60/60)
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




  const getStarted = async() => {
      const web3Modal = new Web3Modal({})
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

      let isStarted = await liveAuctionFactoryContract.isStarted()
      
      let currentTokenId = await liveAuctionFactoryContract.getCurrentItem()

      if (currentTokenId > index) {
        setStarted(true)
        setEnded(true)
      }

      try {
        let cBid = await liveAuctionFactoryContract.getBid()
        console.log(cBid)
        let res = utils.formatEther(cBid);
        res = Math.round(res * 1e5) / 1e5;
        console.log(res);
        let currBid = res
        setCurrentBid(currBid)
      } catch {
          setCurrentBid(0)
      }
      
      if (isStarted) {
        let currentTokenId = await liveAuctionFactoryContract.getCurrentItem()
        currentTokenId = currentTokenId.toNumber()
        if (currentTokenId === index) {
          setStarted(true)
          const endAt = await liveAuctionFactoryContract.getEndAt()
          const secondsLeftInAuction = Math.floor((new Date(endAt.toNumber()*1000) - new Date())/1000)
          if (secondsLeftInAuction < 0) {
            setEnded(true)
          }

          return endAt.toNumber()

        } else {
          return 0
        }
      } else {
        return 0
      }
    return 0
  }



  const PlaceBid = async() => {
      setBidLoading(true)
      setBidError(false)
      setBidSuccess(false)
      const web3Modal = new Web3Modal({})
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

      let lastBid = 0;
      try {
        lastBid = await liveAuctionFactoryContract.getBid()
        lastBid = lastBid.toNumber()
      } catch (e) {
        console.log(e)  
      }
      
      console.log(lastBid, "lastbid")

      try {
      let currentBid = ethers.utils.parseUnits(bidAmount.toString(), 'ether')
      } catch {
          let currentBid = 0
          setBidLoading(false)
          setBidError(true)
      }
      console.log(currentBid, "currentbid")
      
      
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

  const WithdrawFunds = async() => {
      setWithdrawError(false)
      setWithdrawSuccess(false)
      setWithdrawLoading(true)
      const web3Modal = new Web3Modal({})
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
      
      let transaction;
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

  return (
    <>
      
        <Col style={{paddingBottom: "20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Card className="bg-light shadow-sm"
              style={{ width: '23rem', height: '36rem', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
              { (fileType.toString().includes('png') || fileType.toString().includes('gif') || fileType.toString().includes('jpg') 
              || fileType.toString().includes('jpeg')) ? (<NFTImage output={image}/>) : 
              (<NFTPlayer output={image}/>) }
            
            <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col >
                        <Card.Title className="text-dark truncate" style={{fontSize: 16}}>{name}</Card.Title>
                    </Col>
                    <Col >
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>
                        {(started && !ended) ? (<Card.Text> {remainingTime.minutes} : {remainingTime.seconds}</Card.Text>) :
                          (started && ended) ? (<Card.Text>Ended</Card.Text>) :
                         (<Card.Text>Not Started</Card.Text>)}</Card.Title>
                    </Col>
              </Row>
              <br></br>
              <Row className="d-flex flex-row" style={{flexDirection:"column", paddingTop: "2rem"}}>
                    {/* <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        {(artistPhoto) ? (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>) :
                        (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={monkey} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>)} 
                        @{artist}</Card.Text>
                    </Col> */}
                    {(sold) ? (
                      <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        Sold to: {(ownerName) ? (ownerName) : ("...".concat(owner.slice(25,43)))}
                        </Card.Text>
                      </Col>
                    ) : (
                    <>
                    <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        Your Bid: {(currentBid) ? (currentBid) : (0)}<img style={{display: "inline"}} src={img} height="20" width="20"/>
                        </Card.Text>
                    </Col>
                    <Col>
                      <Card.Text className="text-dark" style={{fontSize: 12, float:"right"}}>
                        {editionsPerAuction[0]} Editions
                      </Card.Text>
                    </Col>
                    </>
                    )
                    }
                    

              </Row>

            </Card.Body>
            <Card.Footer className="bg-dark text-muted">
            <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col style={{float: "right"}}>
                  <img style={{float: "right"}} src={nftyimg} width="25px" height="25px"/>
                </Col>
              </Row>
              {/* <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {(started && ended) ? (<></>) : (started) ? (<Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {handleShowBidModal(); e.preventDefault()}}>Place Bid</Button>) : (<></>)}
                   

                </Col>
                <Col style={{float: 'right'}}>
                  <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem", float:"right" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {WithdrawFunds();handleShowWithdrawLoadingModal(); e.preventDefault()}}>Withdraw</Button>
                </Col>
              </Row> */}
            </Card.Footer>
        </Card>
        </Col>
      

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal} bidLoading={bidLoading} bidError={bidError} bidSuccess={bidSuccess} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} withdrawLoading={withdrawLoading} withdrawError={withdrawError} 
    withdrawSuccess={withdrawSuccess} handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} />
   
        
      
    </>
  )
}

export default ProductCardsLayoutLiveMobile