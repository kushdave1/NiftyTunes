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

// functions
import { StartAuction } from '../nftymarketplace/StartAuction'
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
import legendaryband from '../../assets/images/legendaryband.png'

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

import { usePlaceBid } from "../../providers/PlaceBidProvider/PlaceBidProvider";



import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"
import styled from "styled-components"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function BidCardAdmin({auctionAddress, mintAddress, signerAddress, responsive, editionsPerAuction, tier, indexNumber, auction}) {





  const [showStartModal, setShowStartModal] = useState(false)
  const [showMetaModal, setShowMetaModal] = useState(false)

  const [minBid, setMinBid] = useState()
  const [nftEditions, setNFTEditions] = useState()
  const [showGenerating, setShowGenerating] = useState(false)

  const [auctionStarted, setAuctionStarted] = useState(false)
  const [auctionLoading, setAuctionLoading] = useState(true)
  const [startError, setStartError] = useState(false)
  

  const handleShowStartModal = () => setShowStartModal(true)
  const handleCloseStartModal = () => setShowStartModal(false)

  const handleMetaModalShow = () => setShowMetaModal(true)
  const handleMetaModalClose = () => setShowMetaModal(false)

  const handleShowGenerating = () => setShowGenerating(true)
  const handleCloseGenerating = () => setShowGenerating(false)

  




  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const [showBidModal, setShowBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

 

  const [auctionTime, setAuctionTime] = useState()
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
   
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")

  const [showWithdrawLoadingModal, setShowWithdrawLoadingModal] = useState(false)

  const { withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading,
    started, setStarted, ended, setEnded, currentBid, setCurrentBid, highestBid, setHighestBid, bidAmount, setBidAmount,
    ifWinningBid, setIfWinningBid, lowestBid, setLowestBid } = usePlaceBid()

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
      checkIfWinningBid()
      

   
      
      console.log(parseInt("00"))
  }, [])

  const PadWithZeros = (number) => {
      let paddedNumber
      let zero = "0"
      if (parseInt(number) < 10) {
        paddedNumber = zero.concat(number)
      }
      return paddedNumber

  }





const WithdrawFundsAndUploadMetadata = async() => {


  setWithdrawError(false)
  setWithdrawSuccess(false)
  setWithdrawLoading(true)
  const web3Modal = new Web3Modal({})
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)


  try {
    await liveAuctionFactoryContract.end(mintAddress)
    setWithdrawSuccess(true)
  } catch {
    setWithdrawError(true)
    setWithdrawLoading(false)
  }
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
      const timeLeftIn = await GetStarted(auctionAddress, started, setStarted, ended, setEnded, 
        currentBid, setCurrentBid, highestBid, setHighestBid, bidAmount, setBidAmount,
        ifWinningBid, setIfWinningBid, lowestBid, setLowestBid, editions)

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
          <SeeNFTs>
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
                            {(remainingTime.seconds > -1) ? (<>{remainingTime.hours} : {remainingTime.minutes} : {remainingTime.seconds}</>) :
                            (remainingTime.seconds < -1 && remainingTime.hours < -3000 || remainingTime.minutes < 0 && remainingTime.hours < -3000) ? (<div style={{fontSize: "10px"}}>Not Started</div>) :
                         (<div style={{fontSize: "10px"}}>Ended</div>)}
                            </CalculatedTime>
                          </BidTimeBox>
                        </BidTimeWBid>
    )
  }

  return (
    <>
       
        
                {
                
                (tier === "Legendary") ? (
                  <Card style={{padding: "16px 20px 16px 20px", display: "flex", flexDirection: "column", width: "420px", height: "181px",
                  borderRadius: "10px 10px 0px 0px", gap: "10px", backgroundImage: `url(${legendaryband})`}}>
                    <CardSectionWBid>
                      <CardHeaderWithBidLegendary/>
                      <BidBoxWBid>
                        <OutBidButton onClick={() => handleShowStartModal()}>
                          <BidButtonText>
                          Start
                          </BidButtonText>
                        </OutBidButton>
                        <WithdrawBidButton style={{background: `url(${legendaryband})`}} onClick={()=>handleMetaModalShow()}>
                          <WithdrawBidText>
                            Withdraw Funds
                          </WithdrawBidText>
                        </WithdrawBidButton>
                        <BidTimeWithBid/>
                    
                      </BidBoxWBid>
                      
                        <BidTimeWithBid/>
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
                          <SeeNFTs>
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                      </CardHeaderWBid>
                      <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowStartModal()}>
                    <BidButtonText>
                    Start
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#FD4758"}} onClick={()=>handleMetaModalShow()}>
                      <WithdrawBidText>
                        Withdraw Funds
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
                          <SeeNFTs>
                            See NFTs
                          </SeeNFTs>
                        </TopNFTs>
                        
                    </CardHeaderWBid>
                    <BidBoxWBid>
                    <OutBidButton onClick={() => handleShowStartModal()}>
                    <BidButtonText>
                    Start
                    </BidButtonText>
                    </OutBidButton>
                    <WithdrawBidButton style={{background: "#EDCF92"}} onClick={()=>handleMetaModalShow()}>
                      <WithdrawBidText>
                        Withdraw Funds
                      </WithdrawBidText>
                    </WithdrawBidButton>
                    <BidTimeWithBid/>
                  
                  </BidBoxWBid>
                </CardSectionWBid>
                </Card>
                )
              
              
              }
            
            {/* <Card.Header>
            <Row>
                <Col>
                <Button style={{ color: "white", background: "black", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "black"}}  
                    onClick={()=>{showAuctionCardData(0, editionsPerAuction);checkIfWinningBid();}}>Refresh Bids</Button>
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
                        <Card.Title className="text-dark truncate" style={{fontSize: 12}}>Highest Bid: {highestBid} ETH</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Button style={{ color: "green", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "green"}} 
                    onClick={()=>handleShowBidModal()}>Outbid</Button>
                    </Col>
              </Row>
              <hr></hr>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 12}}>Lowest Winning Bid: {lowestBid} ETH</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Button style={{ color: "green", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "green"}} 
                    onClick={()=>handleShowBidModal()}>Outbid</Button>
                    </Col>
              </Row>
              <hr></hr>
              <Row className="d-flex flex-row" style={{flexDirection:"column", paddingBottom: "10px"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 12}}>Your Bid: {currentBid} ETH</Card.Title>
                        {(ifWinningBid) ? (<Card.Title className="truncate" style={{fontSize: 12, color: "green"}}>IN THE MONEY</Card.Title>) : (
                            <Card.Title className="truncate" style={{fontSize: 12, color: "red"}}>MUST BID MORE TO WIN AN NFT!</Card.Title>
                        )}
                    </Col>
                    <Col sm={4}>
                    {(ifWinningBid) ? (<></>) : (
                        <Button style={{ color: "red", background: "white", pointerEvents: "auto", borderRadius:"2.0rem", borderColor: "red"}} 
                    onClick={()=>{handleShowWithdrawLoadingModal(); WithdrawFunds(withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading, auctionAddress)}}>Withdraw</Button>
                    )}
                    </Col>
              </Row>
            
            </Card.Body> */}
              

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress} editionsPerAuction={editionsPerAuction}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} 
    handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} auctionAddress={auctionAddress}/>

{showMetaModal && <NFTModalNftyLive tier={tier} mintAddress={mintAddress} auction={auction} tokenId={indexNumber} auctionAddress={auctionAddress} show={showMetaModal} setShow={setShowMetaModal} toggleShow={handleMetaModalClose} 
editionsPerAuction={editionsPerAuction}/>}


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
        onClick={()=>{handleCloseStartModal();handleShowGenerating();StartAuction(auctionTime, minBid, mintAddress, nftEditions, auctionAddress,  setAuctionStarted, setStartError);}}>
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

export default BidCardAdmin

const CardTitle = styled.div`
width: 152px;
height: 57px;
left: 0px;
top: 0px;

/* H5 */

font-family: 'Druk Cyr';

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
