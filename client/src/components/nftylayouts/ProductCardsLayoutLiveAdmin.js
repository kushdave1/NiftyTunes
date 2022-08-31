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



import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function ProductCardsLayoutLiveAdmin({index, owner, ownerName, artistName, artist, artistPhoto, collection, image, 
coverArt, name, description, nft, auctionAddress, editionsPerAuction, fileType}) {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const [showStartModal, setShowStartModal] = useState(false)
  const [showMetaModal, setShowMetaModal] = useState(false)

  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false) 

  const [auctionTime, setAuctionTime] = useState()
  const [minBid, setMinBid] = useState()
  const [nftEditions, setNFTEditions] = useState()
  const [showGenerating, setShowGenerating] = useState(false)

  const [auctionStarted, setAuctionStarted] = useState(false)
  const [auctionLoading, setAuctionLoading] = useState(true)
  const [startError, setStartError] = useState(false)
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
  
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")

  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(true)
  const [withdrawError, setWithdrawError] = useState(false)

  const handleShowStartModal = () => setShowStartModal(true)
  const handleCloseStartModal = () => setShowStartModal(false)

  const handleMetaModalShow = () => setShowMetaModal(true)
  const handleMetaModalClose = () => setShowMetaModal(false)

  const handleShowGenerating = () => setShowGenerating(true)
  const handleCloseGenerating = () => setShowGenerating(false)

  

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

      const hoursLeft = Math.floor((new Date(countdown*1000) - new Date())/1000/60/60)
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

      try {
        await liveAuctionFactoryContract.end()
        setWithdrawSuccess(true)
      } catch {
        setWithdrawError(true)
        setWithdrawLoading(false)
      }
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
      console.log(currentTokenId.toNumber(), index, "This is the current item and index")

      if (currentTokenId.toNumber() > 0) {
      
        setStarted(true)
        setEnded(true)
      }
      
      if (isStarted) {
        let currentTokenId = await liveAuctionFactoryContract.getCurrentItem()
        currentTokenId = currentTokenId.toNumber()
        if (currentTokenId === 0) {
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



  const StartAuction = async() => {
      
      const signer = await ConnectWallet()

      const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)

      const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

      const price = ethers.utils.parseUnits(minBid, 'ether')
      let transaction = await liveAuctionFactoryContract.start(auctionTime, price, nftEditions)

      try {
          await transaction.wait()
          
          setAuctionLoading(false)
         
      } catch (error) {
          console.log(error)
          setAuctionLoading(false)
          setStartError(true)
          return
      }

      setAuctionStarted(true)
  }

  return (
    <>
    <Col xs={1} md={4} style={{paddingBottom:"20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`/${artist}/${name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="bg-light shadow-sm"
              style={{ width: '23rem', height: '33rem', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
              { (fileType.toString().includes('png') || fileType.toString().includes('gif')) ? (<NFTImage output={image}/>) : 
              (<NFTPlayer output={image}/>) }
            
            <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 16}}>{name}</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>
                        {(started && !ended) ? (<Card.Text> {remainingTime.hours} : {remainingTime.minutes} : {remainingTime.seconds}</Card.Text>) :
                          (started && ended) ? (<Card.Text>Ended</Card.Text>) :
                         (<Card.Text>Not Started</Card.Text>)}</Card.Title>
                    </Col>
              </Row>
              <br></br>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        {/* <Card.Text className="text-dark" style={{fontSize: 12}}>
                        {(artistPhoto) ? (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>) :
                        (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={monkey} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>)} 
                        {artist}</Card.Text> */}
                    </Col>
                    <Col>
                      <Card.Text className="text-dark" style={{fontSize: 12, float:"right"}}>
                        {editionsPerAuction[0]} Editions
                      </Card.Text>
                    </Col>
              </Row>

            </Card.Body>
            <Card.Footer className="bg-dark text-muted">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {/* {(started && ended) ? (<Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => { e.preventDefault();}}>Withdraw</Button>) : (started) ? (<></>) : (<StartAuctionButton setShowStartModal={setShowStartModal}/>)} */}
                  {/* <StartAuctionButton setStarted={setStarted}/> */}
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  {(started) ? (<Button className="button-hover" variant="secondary" 
                  style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem", width: "500px" }} 
                  onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} 
                  onClick={(e) => {setShowMetaModal(true); e.preventDefault();console.log(showMetaModal);}}>Withdraw Funds/📁 Metadata</Button>) : (<StartAuctionButton setShowStartModal={setShowStartModal}/>)}
                </Col>
              </Row>
            </Card.Footer>
        </Card>
      </Link>
    </Col>
    {showMetaModal && <NFTModalNftyLive tokenId={index} auctionAddress={auctionAddress} show={showMetaModal} setShow={setShowMetaModal} toggleShow={handleMetaModalClose}/>}


    <Modal show={showStartModal} onHide={handleCloseStartModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            Configure your Auction Time and Starting Bid!
        </Modal.Title>
        <Form style={{padding: "30px"}}>
            <Form.Group className="mb-3" controlId="nft.auctionTime">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Time (min)"
                    style={{width: "150px"}}
                    className="mb-3"
                >
                <Form.Control 
                    type="input"
                    placeholder= 'Auction Time (Minutes)'
                    
                    value={auctionTime}
                    onChange={e => setAuctionTime(e.target.value)}/>
                    
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="nft.minBid">
                <FloatingLabel
                    controlId="floatingInput"
                    label='Min. Bid (ETH)'
                    style={{width: "150px"}}
                    className="mb-3"
                >
                <Form.Control 
                    type="input"
                    placeholder= 'Minimum Bid (ETH)'
                    
                    value={minBid}
                    onChange={e => setMinBid(e.target.value)}/>
                    
                </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="nft.nftEditions">
                <FloatingLabel
                    controlId="floatingInput"
                    label='NFT Editions'
                    style={{width: "150px"}}
                    className="mb-3"
                >
                <Form.Control 
                    type="input"
                    placeholder= 'Number of Editions'
                    
                    value={nftEditions}
                    onChange={e => setNFTEditions(e.target.value)}/>
                    
                </FloatingLabel>
            </Form.Group>
            <Button variant="dark" style={{borderRadius: "2rem", float: "right", width: "100px"}} 
            onClick={()=>{handleCloseStartModal();handleShowGenerating();StartAuction();}}>
                Start
            </Button>
        </Form>      
    </Modal>

    <Modal show={showGenerating} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Starting your Auction!
            </Modal.Title>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Starting the <span className="text-primary">Live </span><br/>Auction</h4>
                    <small className='text-muted'>This should only take a minute</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(auctionLoading) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (startError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            {auctionStarted &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congratulations! Your Auction has started!
                <Alert.Link onClick={() => handleCloseGenerating()}>Go back to Auction Console</Alert.Link>
                </Alert>
            }
            {startError && 
              <Alert variant='danger' >
                <i class="bi bi-check-circle-fill"></i>
                {' '} Your transaction failed because the auction has already started! <br /><br /> Only one NFT may be auctioned at a time.
                <Alert.Link onClick={() => handleCloseGenerating()}><br />Go back to Auction Console</Alert.Link>
                </Alert>

            }
      </Modal>
      
    </>
  )
}

export default ProductCardsLayoutLiveAdmin