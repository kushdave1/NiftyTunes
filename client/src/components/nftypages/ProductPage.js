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

//custom
import NFTPlayerLarge from '../nftymix/NFTPlayerLarge'

//Solidity Functions

import BuyNFTButton from "../nftySolidityButtons/BuyNFTButton"
import BuyLazyNFTButton from "../nftySolidityButtons/BuyLazyNFTButton"

// Cloud Functions
import { fetchArtistName, fetchArtistPhoto } from "../nftyFunctions/fetchCloudData"

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


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";

import styled from 'styled-components'

import { APP_ID, SERVER_URL } from '../../index'

const HeaderSection = styled.div `
    display:flex;
    flex:1;
    overflow:hidden;
    background-color: white;
    min-height: 100vh;
    padding-top: 75px;
`;



function ProductPage() {
  
  
  const { owner, name } = useParams();
  const { isInitialized, isAuthenticated, user } = useMoralis()
  const [ownerName, setOwnerName] = useState(`${owner}${name}`);
  const [nft, setNft] = useState([{
    price: "", 
    tokenId: "",
    owner: "",
    gallery: "",
    image: "",
    name: "",
    description: "",
    tokenURI: "",
    lazy: true
  }]);

  const appId = APP_ID;
  const serverUrl = SERVER_URL;   
  Moralis.start({ serverUrl, appId});


  const { fetch } = useMoralisQuery(
    "ListedNFTs",
    (query) => query.equalTo("ownerName", ownerName),
    [],
    { autoFetch: false }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    
    
    basicQuery();
    setIsLoading(false);

  }, [owner, name]);

  const basicQuery = async() => {
    const results = await fetch();
    const object = results[0]
    const meta = await axios.get(fixURL(object.get('tokenURI')))

    const artistPhoto = await fetchArtistPhoto(object.get("signerAddress"))
    const artistName = await fetchArtistName(object.get("signerAddress"))

    const ownerPhoto = await fetchArtistPhoto(object.get("buyerAddress").slice(-1)[0])
    const ownerName = await fetchArtistName(object.get("buyerAddress").slice(-1)[0])
    
    setNft((previousNft) =>[{
      price: object.get("price"), 
      tokenId: object.get("tokenId"),
      owner: object.get("buyerAddress").slice(-1)[0],
      artist: object.get("signerAddress"),
      artistPhoto: artistPhoto,
      artistName: artistName,
      ownerPhoto: ownerPhoto,
      ownerName: ownerName,
      voucher: object.get("voucher"),
      createdAt: object.get("createdAt").toUTCString(),
      gallery: object.get("galleryAddress"),
      image: fixURL(meta.data.image),
      name: meta.data.name,
      description: meta.data.description,
      tokenURI: object.get("tokenURI"),
      isSold: object.get("isSold")
    }]);
    console.log(nft)
  };

  const singleQuery = () => {
    fetch({
      onSuccess: (result) => console.log(result[0]),
    });
  }
  return (
    <>
      {!isLoading && (
        <HeaderSection>
            <Container fluid="sm">
            
                <center>
                    <NFTPlayerLarge output={nft[0].image}/>
                </center>
                <hr/>
                <Row class="d-flex" style={{paddingBottom: "5px"}}>
                  <Col style={{fontWeight: "Bold"}}>Artist: {nft[0].artistPhoto && <img height="25" width="25" crossOrigin='true' 
                  crossoriginresourcepolicy='false' style={{borderRadius: "2rem", display: "inline"}} src={nft[0].artistPhoto}></img>} {nft[0].artistName}</Col>
                 
                  <Col className="d-flex justify-content-end" style={{fontWeight: "Bold"}}>Owner: {nft[0].ownerPhoto && 
                  <img height="25" width="25" crossOrigin='true' crossoriginresourcepolicy='false' style={{borderRadius: "2rem", display: "inline"}} 
                  src={nft[0].ownerPhoto}></img>} {nft[0].ownerName}</Col>
               
                  
                
                </Row>
                <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <div style={{fontWeight: "Bold", fontSize: 60, paddingTop: 40}}>{nft[0].name} {(nft[0].isSold) ? (<BuyNFTButton></BuyNFTButton>) : (<BuyLazyNFTButton nft={nft[0]}></BuyLazyNFTButton>)}</div>
                        
                        <div style={{fontWeight: "Bold", fontSize: 16}}>Minted on: {nft[0].createdAt}</div>
                        
                        <div style={{fontWeight: "Bold", fontSize: 20, marginTop: 100, display: "flex"}}>List Price: <img src={img} height="30" width="30"></img>{nft[0].price}</div >
                        <div style={{fontWeight: "Bold", fontSize: 30, paddingBottom: 20}}><hr/>Description</div>
                        
                        <ListGroup style={{paddingBottom: 50}}>
                            
                            <ListGroup.Item style={{fontSize: 16, paddingTop: 20, paddingBottom: 20}}>{nft[0].description}</ListGroup.Item>
                            
                        </ListGroup>
                    </Col>
                    
                    <Col style={{marginLeft: "300px", paddingTop: 20}}>
                        <div style={{fontWeight: "Bold", fontSize: 30, paddingTop: 20, paddingBottom: 20}}><hr/>Offers</div>
                        <ListGroup style={{paddingTop: "10px"}}>
                            <ListGroup.Item style={{fontWeight: "Bold"}}>
                              Bid 1
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                </Row>
            </Container>
        </HeaderSection>
      )}
    </>
  );
};

export default ProductPage;