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

import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function ProductCardsLayoutLiveAdmin({index, owner, ownerName, artistName, artist, artistPhoto, collection, image, coverArt, name, description, nft, auctionAddress}) {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00'
    //hours: '00'
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

      const hoursLeftInAuction = Math.floor((new Date(countdown*1000) - new Date())/1000/60/24)
      const hoursLeft = hoursLeftInAuction % 24
      const remaintime = {
        seconds: secondsLeft.toString(),
        minutes: minutesLeft.toString(),
        //hours: hoursLeft.toString()
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
        let cBid = await liveAuctionFactoryContract.getBid(index)
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
      const web3Modal = new Web3Modal({})
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
      const price = ethers.utils.parseUnits(bidAmount, 'ether')
      

      try {
          await liveAuctionFactoryContract.bid({value: price})
          setBidLoading(false)
         
      } catch (error) {
        
          setBidLoading(false)
          setBidError(true)
          return
      }

      setBidSuccess(true)
  }

  const WithdrawFunds = async() => {
      const web3Modal = new Web3Modal({})
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
      

      try {
          await liveAuctionFactoryContract.withdraw()
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
    <Col xs={1} md={4} style={{paddingBottom:"20px"}}>
      <Link to={`/${artist}/${name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="bg-light shadow-sm"
              style={{ width: '23rem', height: '33rem', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
              { (image.toString().includes('png') || image.toString().includes('gif')) ? (<NFTImage output={image}/>) : 
              (<NFTPlayer output={image}/>) }
            
            <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 16}}>{name}</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>
                        {(started && !ended) ? (<Card.Text> {remainingTime.minutes} : {remainingTime.seconds}</Card.Text>) :
                          (started && ended) ? (<Card.Text>Ended</Card.Text>) :
                         (<Card.Text>Not Started</Card.Text>)}</Card.Title>
                    </Col>
              </Row>
              <br></br>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    {/* <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        {(artistPhoto) ? (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>) :
                        (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={monkey} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>)} 
                        @{artist}</Card.Text>
                    </Col> */}
                    <Col>
                        <Card.Text className="text-dark" style={{fontSize: 10}}>
                        Your Current Bid: {currentBid}<img style={{display: "inline"}} src={img} height="20" width="20"/>
                        </Card.Text>
                    </Col>

              </Row>

            </Card.Body>
            <Card.Footer className="bg-dark text-muted">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {(started && ended) ? (<></>) : (started) ? (<Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {handleShowBidModal(); e.preventDefault()}}>Place Bid</Button>) : (<></>)}
                   
                  {/* <StartAuctionButton setStarted={setStarted}/> */}
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {WithdrawFunds();handleShowWithdrawLoadingModal(); e.preventDefault()}}>Withdraw</Button>
                </Col>
              </Row>
            </Card.Footer>
        </Card>
      </Link>
    </Col>

    <Modal show={showBidModal} onHide={handleCloseBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            How much would you like to bid on this NFT for?
        </Modal.Title>
        <Form style={{padding: "30px"}}>
            <Form.Group className="mb-3" controlId="nft.bidAmount">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Price (ETH)"
                    style={{width: "150px"}}
                    className="mb-3"
                >
                <Form.Control 
                    type="input"
                    placeholder= 'Auction Time (Minutes)'
                    
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}/>
                    
                </FloatingLabel>
            </Form.Group>
            <Button variant="dark" style={{borderRadius: "2rem", float: "right", width: "100px"}} 
            onClick={()=>{handleCloseBidModal();handleShowBidLoadingModal();PlaceBid()}}>
                Place Bid
            </Button>
        </Form>      
    </Modal>

    <Modal show={showBidLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Placing your Bid!
            </Modal.Title>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Placing the <span className="text-primary">Live </span><br/>Bid</h4>
                    <small className='text-muted'>This should only take a minute</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(bidLoading) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (bidError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            {bidSuccess &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congratulations! Your bid has been placed!
                <Alert.Link onClick={() => handleCloseBidLoadingModal()}>Go back to Auction Console</Alert.Link>
                </Alert>
            }
            {bidError && 
              <Alert variant='danger' >
                <i class="bi bi-check-circle-fill"></i>
                {' '} Your transaction failed
                <Alert.Link onClick={() => handleCloseBidLoadingModal()}><br />Go back to Auction Console</Alert.Link>
                </Alert>

            }
      </Modal>

      <Modal show={showWithdrawLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Placing your Bid!
            </Modal.Title>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Withdrawing the <span className="text-primary">Live </span>Bid</h4>
                    <small className='text-muted'>This should only take a minute</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(withdrawLoading) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (withdrawError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            {withdrawSuccess &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congratulations! Your Withdrawal has been successful!
                <Alert.Link onClick={() => handleCloseWithdrawLoadingModal()}>Go back to Auction Console</Alert.Link>
                </Alert>
            }
            {withdrawError && 
              <Alert variant='danger' >
                <i class="bi bi-check-circle-fill"></i>
                {' '} Your transaction failed
                <Alert.Link onClick={() => handleCloseWithdrawLoadingModal()}><br />Go back to Auction Console</Alert.Link>
                </Alert>

            }
      </Modal>
   
        
      
    </>
  )
}

export default ProductCardsLayoutLiveAdmin