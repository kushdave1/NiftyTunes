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
import axios from 'axios';
import xtype from 'xtypejs'

// Cloud Functions
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"
import Banner from '../../assets/images/bannerOne.jpeg';
import DefaultProfilePicture from '../../assets/images/gorilla.png';

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
import ProductListLayout from "../nftylayouts/ProductListLayout"
import LiveNFTTokenIds from "../nftymarketplace/LiveNFTTokenIds"
import NFTPlayerLarge from "../nftymix/NFTPlayerLarge"
import AuctionBoard from '../nftylayouts/AuctionBoardLayout'

import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

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
  
  
  const { liveMintAddress, collectionName } = useParams();
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

  useEffect(async() => {
    
    
    await basicQuery();
    setIsLoading(false);

  }, [liveMintAddress, collectionName]);

  const basicQuery = async() => {
    const results = await fetch();
    const object = results[0]
    console.log(object)

    // const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))
    const artistName = await fetchArtistName(object.get("signerAddress"))
    
    setAuction(previousAuction =>[...previousAuction, {
      
      collectionName: object.get("CollectionName"),
      collectionSymbol: object.get("CollectionSymbol"),
    //   artist: object.get("signerAddress"),
    //   artistPhoto: artistPhoto,
      artistName: artistName,
      createdAt: object.get("createdAt").toUTCString(),
      auctionAddress: object.get("liveAuctionAddress"), 
      mintAddress: object.get("liveMintAddress"), 
      stream: object.get("streamLink"),
      mintNumber: parseInt(object.get("MintNumber")),
      royalty: object.get("royalty"),
      coverArt: object.get("CoverArtURL"),
      bannerArt: object.get("bannerImageURL"),
      collectionDescription: object.get("description"),
      signerAddress: object.get("signerAddress")
      

    }])

    console.log(auction[1])
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
        {(auction[1].bannerArt) ? (<img crossOrigin='true' crossoriginresourcepolicy='false' src={auction[1].bannerArt} height="250px" width="100%" style={{backgroundSize: "100%", zIndex: "1"}}></img>) :
            (<img crossOrigin='true' crossoriginresourcepolicy='false' src={Banner} height="250px" width="100%" style={{backgroundSize: "100%", zIndex: "1"}}></img>)}
        <HeaderSection>
            
            <Container fluid="sm">
              <center>
                {(auction[1].coverArt) ? 
                                    (
                                    <img crossOrigin='true' crossoriginresourcepolicy='false' src={auction[1].coverArt} height="150px" width="150px" 
                                    style={{boxShadow: "1px 1px 1px 1px #888888", marginTop: "-175px", zIndex: "2", borderRadius: "5.00rem"}}></img>) 
                                    : (<img src={DefaultProfilePicture} height="150px" width="150px" 
                                    style={{padding: "10px",border: "2px solid black", marginTop: "-175px",borderRadius: "5.00rem", zIndex: "2"}}></img>)}
                                    <div className="pt-3" style={{fontSize: 20}}>{auction[1].collectionName}</div><br/><div style={{fontSize: 12}}>By {auction[1].artistName}</div>
              </center>
                <hr/>
                <Row>
                  <Col>
                    <YoutubeEmbed embedId="sdfomsdo"/>
                  </Col>
                  <Col>
                    <AuctionBoard auctionAddress={auction[1].auctionAddress} signerAddress={auction[1].signerAddress} />
                  </Col>
                </Row>
                <hr></hr>
                <Row className="p-2">
                
                    <ProductListLayout>
                        <LiveNFTTokenIds auction={auction[1]} />
                    </ProductListLayout>    
                        
                </Row>
                
            </Container>
        </HeaderSection>
        </>
      )}
    </>
  );
};

export default LiveCollectionPage;