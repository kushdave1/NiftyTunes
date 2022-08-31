import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"

import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import xtype from 'xtypejs'
import xicon from '../../assets/images/xicon.png'
import pdfHowItWorks from '../../assets/images/pdfHowItWorks.png'

import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'
// Cloud Functions
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"
import Banner from '../../assets/images/bannerOne.jpeg';
import DefaultProfilePicture from '../../assets/images/gorilla.png';
import Table from 'react-bootstrap/Table'
import AuctionModal from '../nftylayouts/AuctionModalLayout'
import { checkFileType } from '../nftyFunctions/checkFileType'


//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { fixURL, fixImageURL } from "../nftyFunctions/fixURL"
import img from "../../assets/images/ethereum.png"

import YoutubeEmbed from "../nftymix/YoutubeEmbed"
import YoutubeEmbedMobile from "../nftymix/YoutubeEmbedMobile"
import ProductListLayout from "../nftylayouts/ProductListLayout"
import LiveNFTTokenIds from "../nftymarketplace/LiveNFTTokenIds"
import NFTPlayerLarge from "../nftymix/NFTPlayerLarge"
import AuctionBoard from '../nftylayouts/AuctionBoardLayout'
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import BidCard from '../nftylayouts/BidCardLayout'
import BidCardMobile from '../nftylayouts/BidCardLayoutMobile'


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";

import styled from 'styled-components'

import { APP_ID, SERVER_URL } from '../../index'


const HeaderSection = styled.div `
    display:flex;
    flex:1;
    background-color: white;
    min-height: 100vh;
    padding-top: 75px;
`;




function LiveCollectionPage() {
  
  const [streamLink, setStreamLink] = useState("")
  const { liveMintAddress, collectionName } = useParams();
  const [width, setWindowWidth] = useState(0)
  const [auctionAddress, setAuctionAddress] = useState("")
  
  const { isInitialized, isAuthenticated, user } = useMoralis()
  const [auction, setAuction] = useState([{
    collectionName: "",
    collectionSymbol: "",
//   artist: object.get("signerAddress"),
//   artistPhoto: artistPhoto,
//   artistName: artistName,
    createdAt: "",
    Auction: "", 
    mintAddress: "", 
    stream: "",
    mintNumber: "",
    royalty: "",
    coverArt: "",
    collectionDescription: ""
  }]);

  const [auctionId, setAuctionId] = useState()
  const [editions, setEditions] = useState()
  const [startingBid, setStartingBid] = useState()
  const [bidAmount, setBidAmount] = useState()
  const [topBidders, setTopBidders] = useState([])
  const [topBids, setTopBids] = useState([])
  const [userBid, setUserBid] = useState()

  const [seeMore, setSeeMore] = useState(true)
  const [showPDF, setShowPDF] = useState(false)

  const [startBidModal, setStartBidModal] = useState(false)
  const [onBidModal, setOnBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidLoading, setBidLoading] = useState(true)
  const [bidError, setBidError] = useState(false)
  const [username, setUsername] = useState("")

  const handleShowPDF = () => setShowPDF(true)
  const handleClosePDF = () => setShowPDF(false)


  const handleShowStartBidModal = () => setStartBidModal(true)
  const handleCloseStartBidModal = () => setStartBidModal(false)

  const handleShowOnBidModal = () => setOnBidModal(true)
  const handleCloseOnBidModal = () => setOnBidModal(false)
  
  const handleShowBidLoadingModal = () => setShowBidLoadingModal(true)
  const handleCloseBidLoadingModal = () => setShowBidLoadingModal(false)


  const appId = APP_ID;
  const serverUrl = SERVER_URL;   
  Moralis.start({ serverUrl, appId});


  const { fetch } = useMoralisQuery(
    "LiveMintedCollections",
    (query) => query.equalTo("liveMintAddress", liveMintAddress),
    [],
    { autoFetch: false }
  );
  

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();


  const PlaceBid = async(auctionAddress) => {
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
      let currentBid
      try {
      currentBid = ethers.utils.parseUnits(bidAmount.toString(), 'ether')
      } catch {
          currentBid = 0
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


  const getContract = async(auctionAddress) => {

        const web3Modal = new Web3Modal({})
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
        const liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);

        return liveAuctionFactoryContract

    }

  useEffect(async() => {
    console.log()
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const auctionAddress = await basicQuery();
    console.log(auctionAddress, "raw")
    setIsLoading(false)
    
    const contract = await getContract(auctionAddress);
    contract.on("Start",  await handleStartEventModal)
    contract.on("Bid", await handleBidEventModal)
    let addresses = []

    return () => {
      window.removeEventListener("resize",updateDimensions);
      contract.removeAllListeners("Start")
      contract.removeAllListeners("Bid")
    }



    

  }, [liveMintAddress, collectionName]);

  const handleStartEventModal = async(highestBid, timestamp) => {
    

    setStartingBid(ethers.utils.formatUnits(highestBid.toString(), 'ether'))
    setEditions(auction[1].editionsPerAuction[0])
    handleShowStartBidModal()
  }

  const handleBidEventModal = async(sender, amount, timestamp) => {
  
    if ((await fetchArtistName(sender)).length === '25') {
      setUsername(sender)
    } else {
      setUsername(await fetchArtistName(sender))
    }
    
    setUserBid(ethers.utils.formatUnits(amount.toString(), 'ether'))


    
    handleShowOnBidModal()
  }

  const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

  const responsive = {
    showTopNavMenu: width > 1023
  }

  const basicQuery = async() => {
    const results = await fetch();
    const object = results[0]
    console.log(object)

    // const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))
    console.log(object.get("CoverArtURL"), 'coverarturl')
    const artistName = await fetchArtistName(object.get("signerAddress"))

    const fileType = await checkFileType(object.get("CoverArtURL"))
    console.log(fileType, "GANGATHON")
    setAuction(previousAuction =>[...previousAuction, {
      
      collectionName: object.get("CollectionName"),
      collectionSymbol: object.get("CollectionSymbol"),
      fileType: fileType,
    //   artist: object.get("signerAddress"),
    //   artistPhoto: artistPhoto,
      artistName: artistName,
      createdAt: object.get("createdAt").toUTCString(),
      auctionAddress: object.get("liveAuctionAddress"), 
      mintAddress: object.get("liveMintAddress"), 
      stream: object.get("StreamLink").split("=").pop(),
      mintNumber: parseInt(object.get("MintNumber")),
      totalEditions: object.get("totalEditions"),
      royalty: object.get("royalty"),
      coverArt: object.get("CoverArtURL"),
      bannerArt: object.get("bannerImageURL"),
      collectionDescription: object.get("description"),
      signerAddress: object.get("signerAddress"),
      date: object.get("date"),
      startTime: object.get("startTime"),
      endTime: object.get("endTime"),
      editionsPerAuction: object.get("editionsPerAuction")
      
      

    }])

    return object.get("liveAuctionAddress")

  };

  const singleQuery = () => {
    fetch({
      onSuccess: (result) => console.log(result[0]),
    });
  }
  return (
    <>
      
      {!isLoading && (
        <>
        {(auction[1].bannerArt) ? (<img crossOrigin='true' crossoriginresourcepolicy='false' src={auction[1].bannerArt} height="250px" width="100%" 
        style={{backgroundSize: "100%", zIndex: "1"}}></img>) : (<img crossOrigin='true' crossoriginresourcepolicy='false' src={Banner} height="250px" 
        width="100%" style={{backgroundSize: "100%", zIndex: "1"}}></img>)}
        {(responsive.showTopNavMenu) ? (<HeaderSection>
            
            <Container fluid="sm">
              <Row>
                <Col sm={4}>

                  <BidCard auctionAddress={auction[1].auctionAddress} responsive={responsive.showTopNavMenu} signerAddress={auction[1].signerAddress}
                  editionsPerAuction={auction[1].editionsPerAuction}/>
                </Col>
                <Col sm={4}>
                  <center>
                    {(auction[1].coverArt) ? 
                                        (
                                        <img crossOrigin='true' crossoriginresourcepolicy='false' src={auction[1].coverArt} height="150px" width="150px" 
                                        style={{boxShadow: "1px 1px 1px 1px #888888", marginTop: "-175px", zIndex: "2", borderRadius: "5.00rem"}}></img>) 
                                        : (<img src={DefaultProfilePicture} height="150px" width="150px" 
                                        style={{padding: "10px",border: "2px solid black", marginTop: "-175px",borderRadius: "5.00rem", zIndex: "2"}}></img>)}
                                        <div className="pt-3" style={{fontSize: 20}}>{auction[1].collectionName}</div>
                                        <div className="text-danger" style={{fontSize: 16}}>Live on {auction[1].date} ({auction[1].startTime} - {auction[1].endTime} EST)</div>
                                        <br/>
                                        {(seeMore) ? (
                                      
                                          <Button style={{fontSize: 12, background: "none", border:'none', color: "grey"}} onClick={()=>setSeeMore(false)}> 
                                          See More</Button>
                                
                                        
                                        ) : (
                                          <>
                                          <div style={{fontSize: 12}}>
                                          By {auction[1].artistName}</div>
                                          <br/><div style={{fontSize: 12}}>
                                          {auction[1].collectionDescription}</div>
                                          <Button style={{fontSize: 12, background: "none", border:'none', color: "grey"}} onClick={()=>setSeeMore(true)}> 
                                          See Less</Button>
                                          </>
                                        )
                                          
                                        }   
                  </center>
                </Col>
                <Col sm={4}>

                  <Button variant="light" style={{borderRadius: "5rem", float: "right", borderColor: "white", boxShadow: "2px 2px 2px 2px #888888"}} onClick={()=>handleShowPDF()}>
                        How it Works
                    </Button>
                </Col>
              </Row>
                <hr/>
                <Row>
                  <Col>
                    <YoutubeEmbed embedId={auction[1].stream}/>
                  </Col>
                  <Col>
                    <AuctionBoard auctionAddress={auction[1].auctionAddress} responsive={responsive.ShowTopNavMenu} mintNumber={auction[1].totalEditions} 
                    signerAddress={auction[1].signerAddress} />
                  </Col>
                </Row>
                <hr></hr>
                <Row className="p-2">
                
                    <ProductListLayout>
                        <LiveNFTTokenIds auction={auction[1]} responsive={responsive.showTopNavMenu}/>
                    </ProductListLayout>    
                        
                </Row>
                
            </Container>
        </HeaderSection>) : (<HeaderSection>
            
            <Container fluid>
              <center>
                {(auction[1].coverArt) ? 
                                    (
                                    <img crossOrigin='true' crossoriginresourcepolicy='false' src={auction[1].coverArt} height="150px" width="150px" 
                                    style={{boxShadow: "1px 1px 1px 1px #888888", marginTop: "-175px", zIndex: "2", borderRadius: "5.00rem"}}></img>) 
                                    : (<img src={DefaultProfilePicture} height="150px" width="150px" 
                                    style={{padding: "10px",border: "2px solid black", marginTop: "-175px",borderRadius: "5.00rem", zIndex: "2"}}></img>)}
                                    <div className="pt-3" style={{fontSize: 20}}>{auction[1].collectionName}</div>
                                    <div className="text-danger" style={{fontSize: 16}}>Live on {auction[1].date} ({auction[1].startTime} - {auction[1].endTime} EST)</div>
                                  
                                    {(seeMore) ? (
                                      
                                          <Button style={{fontSize: 12, background: "none", border:'none', color: "grey"}} onClick={()=>setSeeMore(false)}> 
                                          See More</Button>
                                
                                        
                                        ) : (
                                          <>
                                          <div style={{fontSize: 12}}>
                                          By {auction[1].artistName}</div>
                                          <br/><div style={{fontSize: 12}}>
                                          {auction[1].collectionDescription}</div><br/>
                                          <Button style={{fontSize: 12, background: "none", border:'none', color: "grey"}} onClick={()=>setSeeMore(true)}> 
                                          See Less ^</Button>
                                          </>
                                          
                                        )
                                          
                                        } 
                                        <Row className="py-3 mx-5">
                                        <Button variant="light" style={{borderRadius: "5rem", borderColor: "white", boxShadow: "2px 2px 2px 2px #888888"}} onClick={()=>handleShowPDF()}>
                                          How it Works
                                      </Button>
                                      </Row>
                                        <BidCardMobile auctionAddress={auction[1].auctionAddress} responsive={responsive.showTopNavMenu} signerAddress={auction[1].signerAddress}
                                        editionsPerAuction={auction[1].editionsPerAuction}/>
              </center>
                <hr/>
                <Row>
                    <AuctionBoard auctionAddress={auction[1].auctionAddress} responsive={responsive.ShowTopNavMenu} mintNumber={auction[1].totalEditions} 
                    signerAddress={auction[1].signerAddress} />
                  
                </Row>
                <Row style={{paddingTop:"20px"}}>
                 
                    <YoutubeEmbedMobile embedId={auction[1].stream}/>
                </Row>
                
                <hr></hr>
                <Row className="p-2">
                
                    <ProductListLayout>
                        <LiveNFTTokenIds auction={auction[1]} responsive={responsive.ShowTopNavMenu} />
                    </ProductListLayout>    
                        
                </Row>
                
            </Container>
        </HeaderSection>

        )} 
        </>
      )}

       <Modal show={showPDF} onHide={handleClosePDF} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <Button style={{backgroundColor: "black"}} onClick={()=>handleClosePDF()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
            </Modal.Header>
            <img src={pdfHowItWorks}></img>
                <Row>
                    <Col>
                        <Button variant="dark" style={{borderRadius: "2rem", marginBottom:  "30px", marginRight: "30px", float: "right"}} onClick={()=>handleClosePDF()}>
                            Close
                        </Button>
                    </Col>
                </Row>
        </Modal>

    {startBidModal && <Modal show={handleShowStartBidModal} onHide={handleCloseStartBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <Button style={{backgroundColor: "black"}} onClick={()=>handleCloseStartBidModal()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            The Auction has started with {editions} editions and a starting Bid of {startingBid}
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
            onClick={()=>{handleCloseStartBidModal();handleShowBidLoadingModal();PlaceBid(auction[1].auctionAddress)}}>
                Place Bid
            </Button>
        </Form>      
    </Modal>}

    {onBidModal && <Modal show={handleShowOnBidModal} onHide={handleCloseOnBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <Button style={{backgroundColor: "black"}} onClick={()=>handleCloseOnBidModal()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            {username} has set a bid of {userBid} ETH
        </Modal.Title>
        <div style={{fontSize: 10, padding: "30px 30px 30px 30px"}}>How much would you like to bid on this NFT set for?</div>
        {/* <Table striped bordered hover responsive style={{fontSize: 10, padding: "30px"}}>
          <thead style={{backgroundColor: "black", color: "white"}}>
            <tr>
              <th>Top Bidders</th>
              <th>Top Bids</th>
            </tr>
          </thead>
          <tbody> */}
            {/* <AuctionModal auctionAddress={auction[1].auctionAddress} editions={editions} responsive={responsive.showTopNavMenu} signerAddress={auction[1].signerAddress} /> */}
          {/* </tbody>
        </Table> */}
          
            <Form style={{padding: "30px"}}>
              <Col>
                <Form.Group className="mb-3" controlId="nft.bidAmount">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Bid (ETH)"
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
              </Col>
              <Col>
                <Button variant="dark" style={{borderRadius: "2rem", float: "right", width: "150px"}} 
                onClick={()=>{handleCloseOnBidModal();handleShowBidLoadingModal();PlaceBid(auction[1].auctionAddress)}}>
                    Place Bid
                </Button>
              </Col>
            </Form>      

    </Modal>}

    <Modal show={showBidLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <Button style={{backgroundColor: "black"}} onClick={()=>handleCloseBidLoadingModal()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
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
    </>
  );
};

export default LiveCollectionPage;