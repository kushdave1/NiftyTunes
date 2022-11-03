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
import xicon from '../../../assets/images/xicon.png'
import pdfHowItWorks from '../../../assets/images/pdfHowItWorks.png'

import checkmark from "../../../assets/images/checkmark.png"
import error from '../../../assets/images/error.png'
// Cloud Functions
import { fetchArtistName, fetchArtistPhoto } from "../../nftyFunctions/fetchCloudData"
import Banner from '../../../assets/images/bannerOne.jpeg';
import DefaultProfilePicture from '../../../assets/images/gorilla.png';
import Table from 'react-bootstrap/Table'
import AuctionModal from '../../nftylayouts/AuctionModalLayout'
import { checkFileType } from '../../nftyFunctions/checkFileType'


//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../../nftymarketplace/BuyLazyNFT"
import { fixURL, fixImageURL } from "../../nftyFunctions/fixURL"
import img from "../../../assets/images/ethereum.png"

import YoutubeEmbedPast from "../../nftymix/YoutubeEmbedPast"
import YoutubeEmbedMobile from "../../nftymix/YoutubeEmbedMobile"
import ProductListLayout from "../../nftylayouts/ProductListLayout"
import LiveNFTTokenIds from "../../nftymarketplace/LiveNFTTokenIds__"
import NFTPlayerLarge from "../../nftymix/NFTPlayerLarge"
import AuctionBoard from '../../nftylayouts/AuctionBoardLayout'
import LiveMintAuction from '../../../contracts/LiveMint.sol/LiveMintAuction.json';
import BidCard from '../../nftylayouts/BidCardLayout'
import BidCardMobile from '../../nftylayouts/BidCardLayoutMobile'


import { changeBackground, changeBackgroundBack } from "../../nftyFunctions/hover"

import nftyimg from "../../../assets/images/NT_White_Isotype.png";

import styled from 'styled-components'

import { APP_ID, SERVER_URL } from '../../../index'


const HeaderSection = styled.div `
    display:flex;
    flex:1;
    background-color: black;
    height: 3261px;
`;




function PastCollectionPage() {
  
  const [streamLink, setStreamLink] = useState("")
  const { signerAddress, collectionName } = useParams();
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

  const [seeMore, setSeeMore] = useState(true)
  const [showPDF, setShowPDF] = useState(false)

  const handleShowPDF = () => setShowPDF(true)
  const handleClosePDF = () => setShowPDF(false)


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


  useEffect(async() => {
    console.log()
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    await basicQuery();
    setIsLoading(false)


    return () => {
      window.removeEventListener("resize",updateDimensions);
    } 

  }, [signerAddress, collectionName]);


  const updateDimensions = () => {
      const innerWidth = window.innerWidth
      setWindowWidth(innerWidth)
    }

  const responsive = {
    showTopNavMenu: width > 1023
  }


  const formatDate = (date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = date.getMonth()
    month = months[month]
    let day = date.getDate()
    let year = date.getFullYear()

    return `${month}, ${day} ${year}`
    
  }

  const basicQuery = async() => {
    const results = await fetch();
    const object = results[0]
    console.log(object)

    // const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))
    const artistName = await fetchArtistName(object.get("signerAddress"))
    const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))


    const fileType = await checkFileType(object.get("CoverArtURL"))

    console.log((new Date(object.get("date"))).getDate())
    
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
      date: formatDate(new Date(object.get("date"))),
      startTime: object.get("startTime"),
      endTime: object.get("endTime"),
      editionsPerAuction: object.get("editionsPerAuction"),
      auctionData: object.get("auctionData")
      
      

    }])

  };

  return (
    <>
      
      {!isLoading && (
        <>
        {(responsive.showTopNavMenu) ? (<HeaderSection>
            <YoutubeEmbedPast embedId={auction[1].stream}/>
            <TitleBox>
                <TitleDate>
                    {auction[1].date}
                </TitleDate>
                <TitleLocation>
                    {auction[1].artistName} @ {auction[1].collectionDescription}
                </TitleLocation>
                <ArtistSection>
                    {(auction[1].artistPhoto.length > 0) ? (<ArtistPhoto src={auction[1].artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false'></ArtistPhoto>) : (<ArtistPhoto src={DefaultProfilePicture}></ArtistPhoto>)}
                    <ArtistSubSection>
                        <ArtistLabel>Artist</ArtistLabel>
                        <ArtistName>{auction[1].artistName}</ArtistName>
                    </ArtistSubSection>
                </ArtistSection>
            </TitleBox>
            <NFTSection>
                <Items>
                    Items: {(auction[1].totalEditions.charAt(0) === "0") ? (auction[1].totalEditions.slice(1)) : (auction[1].totalEditions)}
                    
                </Items>
                <div style={{border: "none", width: "100%", opacity: "0.6", marginTop: "-25px", borderBottom: "1px solid white"}} />
                <FilterContainer>
                    <FilterRow>
                        <Col md={2}>
                        <ArtistFilter></ArtistFilter>
                        </Col>
                        <Col md={2}>
                        <TierFilter></TierFilter>
                        </Col>
                        <Col md={2}>

                        </Col>
                        <Col md={2}>

                        </Col>
                        <Col md={2}>
                        </Col>
                        <Col md={2}>
                        <SortFilter></SortFilter>
                        </Col>
                    </FilterRow>
                </FilterContainer>

            </NFTSection>
            </HeaderSection>
            
            ) : (<HeaderSection>
            
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


    </>
  );
};

export default PastCollectionPage;

const TitleBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 20px;

position: absolute;
width: 1039px;
height: 250px;
left: 70px;
top: 466px;
`

const TitleDate = styled.div`
width: 197px;
height: 37px;

/* H6 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 700;
font-size: 36px;
line-height: 101.8%;
/* identical to box height, or 37px */
white-space: nowrap;

letter-spacing: 0.01em;
text-transform: uppercase;

/* white */

color: #FFFFFF;

`

const TitleLocation = styled.div`
width: 1039px;
height: 130px;

/* H3 */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 700;
font-size: 60px;
line-height: 65px;
/* or 108% */

letter-spacing: -0.03em;
text-transform: uppercase;

color: #FFFFFF;
`

const ArtistSection = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 13px;

width: 152px;
height: 43px;

`

const ArtistPhoto = styled.img`
width: 43px;
height: 43px;

border-radius: 153px;

`

const ArtistLabel = styled.div`
width: 28px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */

text-transform: uppercase;

/* white_transparent */

color: rgba(255, 255, 255, 0.5);
`

const ArtistName = styled.div`

width: 96px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: #FFFFFF;
`

const ArtistSubSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

width: 96px;
height: 28px;
`

const NFTSection = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 40px;

position: absolute;
width: 1347px;
height: 1407px;
left: calc(50% - 1347px/2);
top: 860px;

`

const Items = styled.div`

width: 87px;
height: 15px;
white-space: nowrap;
font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 15px;
/* identical to box height, or 73% */

text-transform: uppercase;

color: #FFFFFF;
`

const FilterContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 46px;
    left: 0%;
    top: 60px;
`

const FilterRow = styled(Row)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px;
`

const ArtistFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;

`

const TierFilter = styled.div`
    /* Auto layout */

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;

`



const SortFilter = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 200px;
    height: 46px;

    /* white */

    background: #FFFFFF;
    border-radius: 30px;
`
