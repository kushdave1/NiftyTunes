import React, { useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useMoralis, useNFTBalances } from "react-moralis"
import ProductPageSkeleton from "../nftyloader/ProductPageSkeleton"

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
import LiveNFTTokenIds from "../nftymarketplace/LiveNFTTokenIds__"
import NFTPlayerLarge from "../nftymix/NFTPlayerLarge"
import AuctionBoard from '../nftylayouts/AuctionBoardLayout'
import AuctionBoardMobile from '../nftylayouts/AuctionBoardLayoutMobile'
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import BidCard from '../nftylayouts/BidCardLayout'
import BidCardMobile from '../nftylayouts/BidCardLayoutMobile'
import BidCardAdmin from '../nftylayouts/BidCardLayoutAdmin'


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";
import rightarrow from "../../assets/images/rightarrow.png"
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { GetProvider } from '../nftyFunctions/GetProvider'

import leftarrow from "../../assets/images/leftarrow.png"
import styled from 'styled-components'

import { APP_ID, SERVER_URL } from '../../index'


import * as Desktop from "../nftyCSS/LiveCollectionPageDesktop"


import Web3 from "web3";

import * as Mobile from "../nftyCSS/LiveCollectionPageMobile"




import Carousel from 'react-bootstrap/Carousel';



function LiveCollectionPage() {
  
  const [streamLink, setStreamLink] = useState("")
  const { signerAddress, collectionName } = useParams();
  const [width, setWindowWidth] = useState(0)
  const [auctionAddress, setAuctionAddress] = useState("")



  const [currentAddress, setCurrentAddress] = useState("")
  const [balance, setBalance] = useState("")
  
  const { isInitialized, isAuthenticated, user } = useMoralis()


  const getBalance = async() => {
    let balance = await Moralis.Web3API.account.getNativeBalance({chain: "eth"});
    balance = (balance['balance']/10**18).toFixed(2)

    return balance

  }
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
    (query) => query.equalTo("CollectionName", collectionName),
    [],
    { autoFetch: false }
  );
  

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [userAddress, setUserAddress] = useState("")



  const getContract = async(auctionAddress) => {
        
    let signer
    let liveAuctionFactory
    let liveAuctionFactoryContract

    if (isAuthenticated) {
        signer = await ConnectWallet()
        setUserAddress(await signer.getAddress())
        liveAuctionFactory = new ethers.ContractFactory(LiveMintAuction.abi, LiveMintAuction.bytecode, signer)
        liveAuctionFactoryContract = liveAuctionFactory.attach(auctionAddress);
    } else {
        signer = GetProvider()
        liveAuctionFactoryContract = new ethers.Contract(auctionAddress, LiveMintAuction.abi, signer)

    }

    return liveAuctionFactoryContract

  }

  useEffect(async() => {

     // Only when using npm/yarn
    // await Moralis.enableWeb3({ provider: "walletconnect" });

    // Enable web3 and get the initialized web3 instance from Web3.js
    const contract = await getContract(auctionAddress);


    let realBalance
    if (isAuthenticated) {
      realBalance = await getBalance()
    } else {
      realBalance = 0
    }
    

    setBalance(realBalance)



    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    await basicQuery();
    setIsLoading(false)
    
    if (isAuthenticated) {
      contract.on("Bid", await handleBidEventModal)
    }
    
    let addresses = []

    return () => {
      window.removeEventListener("resize",updateDimensions);
      if (isAuthenticated) {
        contract.removeAllListeners("Start") 
        contract.removeAllListeners("Bid")
      }
      
    }



    

  }, []);

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
    let data = object.get("auctionData")

    let aucdata = data[0]

    const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))
    const artistName = await fetchArtistName(object.get("signerAddress"))


    

    const fileType = await checkFileType(object.get("CoverArtURL"))
    setAuction(previousAuction =>[...previousAuction, {
      
      collectionName: object.get("CollectionName"),
      collectionSymbol: object.get("CollectionSymbol"),
      fileType: fileType,
    //   artist: object.get("signerAddress"),
      artistPhoto: artistPhoto,
      artistName: artistName,
      createdAt: object.get("createdAt").toUTCString(),
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
      editionsPerAuction: object.get("editionsPerAuction"),
      auctionData: object.get("auctionData"),
      location: object.get("location"),
      Legendary: object.get("Legendary"),
      Rare: object.get("Rare"),
      Common: object.get("Common"),
      floors: object.get("floors")
      
      

    }])


  };


  const selectQuery = async() => {
    const results = await fetch();
    const object = results[0]

    // const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))

    const artistName = await fetchArtistName(object.get("signerAddress"))

    const fileType = await checkFileType(object.get("CoverArtURL"))
    setAuction(previousAuction =>[...previousAuction, {
      
      collectionName: object.get("CollectionName"),
      collectionSymbol: object.get("CollectionSymbol"),
      fileType: fileType,
    //   artist: object.get("signerAddress"),
    //   artistPhoto: artistPhoto,
      artistName: artistName,
      createdAt: object.get("createdAt").toUTCString(),
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
      editionsPerAuction: object.get("editionsPerAuction"),
      auctionData: object.get("auctionData"),
      location: object.get("location"),
      Legendary: object.get("Legendary"),
      Rare: object.get("Rare"),
      Common: object.get("Common"),
      floor: object.get("floor")
      

    
    }])


  };



  const singleQuery = () => {
    fetch({
      onSuccess: (result) => console.log(result[0]),
    });
  }
  return (
    <>
      {isLoading ? (Array(1)
                .fill()
                .map((item, index) => {
                    return(
                        <ProductPageSkeleton key={index} />
                    )
                })) : 
      !isLoading && (
        <>
        {(responsive.showTopNavMenu) ? (
        <Desktop.HeaderSection>
            <YoutubeEmbed embedId={auction[1].stream}/>
            <Desktop.Shade/>
            <Link to={`/artist/${auction[1].signerAddress}/items`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
              <Desktop.ArtistOwnerSubSection >
                {(auction[1].artistPhoto) ? (<Desktop.ArtistOwnerPhoto src={auction[1].artistPhoto} crossOrigin='true' 
                crossoriginresourcepolicy='false'/>) : (<Desktop.ArtistOwnerPhoto src={DefaultProfilePicture} />)}
                <Desktop.ArtistOwnerSubBox>
                  <Desktop.ArtistOwner >Artist</Desktop.ArtistOwner>
                  <Desktop.ArtistOwnerName
       >{auction[1].artistName}</Desktop.ArtistOwnerName>
                </Desktop.ArtistOwnerSubBox>
              </Desktop.ArtistOwnerSubSection>
            </Link>
            <Desktop.InfoSection>
              <Desktop.TitleLocation>
                {collectionName} LIVE @ {auction[1].location}{' - '}{auction[1].date}
              </Desktop.TitleLocation>
              <Desktop.DescriptionLocation>
              {auction[1].collectionDescription}
              </Desktop.DescriptionLocation>
            </Desktop.InfoSection>
            
            <Desktop.TierBox
        >
              <Desktop.TiersTitle>Tiers
              </Desktop.TiersTitle>
              <Row>
              {(auction[1].auctionData.map((data, index) => {

                return (
                  <Desktop.AuctionCard md={4} className="mx-2">
                  {(userAddress !== auction[1].signerAddress) ? (<BidCard auctionAddress={data.auctionAddress} mintAddress={data.mintAddress} responsive={responsive.showTopNavMenu} 
                  signerAddress={auction[1].signerAddress} auction={auction[1]}
                      editionsPerAuction={parseInt(data.totalNFTs)} tier={data.tier} indexNumber={index} balance={balance}/>) : (
                        <BidCardAdmin auctionAddress={data.auctionAddress} mintAddress={data.mintAddress} responsive={responsive.showTopNavMenu} signerAddress={auction[1].signerAddress}
                      editionsPerAuction={parseInt(data.totalNFTs)} tier={data.tier} indexNumber={index} balance={balance} auction={auction[1]} />
                      )}
                  <AuctionBoard auctionAddress={data.auctionAddress} responsive={responsive.showTopNavMenu} mintNumber={parseInt(data.totalNFTs)} 
                        signerAddress={auction[1].signerAddress} mintAddress={data.mintAddress} indexNumber={index}/>
                  </Desktop.AuctionCard>
                )
              }))}
              </Row>
              
            </Desktop.TierBox>
        </Desktop.HeaderSection>) : (
        <Mobile.HeaderSection>
            <YoutubeEmbedMobile embedId={auction[1].stream}/>
            <Mobile.Shade/>
            <Mobile.InfoSection>
              <Link to={`/artist/${auction[1].signerAddress}/items`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
                <Mobile.ArtistOwnerSubSection>
                  {(auction[1].artistPhoto) ? (<Mobile.ArtistOwnerPhoto src={auction[1].artistPhoto} crossOrigin='true' 
                  crossoriginresourcepolicy='false'/>) : (<Mobile.ArtistOwnerPhoto src={DefaultProfilePicture} />)}
                  <Mobile.ArtistOwnerSubBox>
                    <Mobile.ArtistOwner>Artist</Mobile.ArtistOwner>
                    <Mobile.ArtistOwnerName>{auction[1].artistName}</Mobile.ArtistOwnerName>
                  </Mobile.ArtistOwnerSubBox>
                </Mobile.ArtistOwnerSubSection>
              </Link>
              <Mobile.TitleLocation>
                {collectionName} LIVE @ {auction[1].location}{' - '}{auction[1].date}
              </Mobile.TitleLocation>
              <Mobile.DescriptionLocation>
              {auction[1].collectionDescription}
              </Mobile.DescriptionLocation>

            </Mobile.InfoSection>
            
            <Mobile.TierBox>

              <Mobile.TiersGap>
        
  
                <Mobile.TiersTitle>Tiers
                </Mobile.TiersTitle>
                
      
              </Mobile.TiersGap>

              <Carousel variant="dark" interval={null}>
              {(auction[1].auctionData.map((data, index) => {

                return (
                  <Carousel.Item>

                  <Mobile.AuctionCard>
                  <BidCardMobile auctionAddress={data.auctionAddress} mintAddress={data.mintAddress} responsive={responsive.showTopNavMenu} 
                  signerAddress={auction[1].signerAddress} auction={auction[1]}
                      editionsPerAuction={parseInt(data.totalNFTs)} tier={data.tier} indexNumber={index} balance={balance}/>
                  <AuctionBoardMobile auctionAddress={data.auctionAddress} responsive={responsive.showTopNavMenu} mintNumber={parseInt(data.totalNFTs)} 
                        signerAddress={auction[1].signerAddress} mintAddress={data.mintAddress} indexNumber={index}/>
                  </Mobile.AuctionCard>
                  </Carousel.Item>
                )
              }))}
              </Carousel>
            </Mobile.TierBox>

            </Mobile.HeaderSection>)
            }
          </>

        )}

       

    {/* {startBidModal && <Modal show={handleShowStartBidModal} onHide={handleCloseStartBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
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
    </Modal>} */}

    {onBidModal && <Modal show={handleShowOnBidModal} onHide={handleCloseOnBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <Button style={{backgroundColor: "black"}} onClick={()=>handleCloseOnBidModal()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            {username} has set a bid of {userBid} ETH
            The bid should appear on the leaderboard in a minute.
        </Modal.Title>
    </Modal>}
{/* 
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
      </Modal> */}
    </>
  );
};

export default LiveCollectionPage;



