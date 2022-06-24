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

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import img from "../../assets/images/ethereum.png"

import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";

import styled from 'styled-components'

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

  const appId = 'T3dcPAckXoTvA6hoPjuRCfT7nDAnh3B4fNx6IOZI';
  const serverUrl = 'https://5p6jpspfzahc.usemoralis.com:2053/server';   
  Moralis.start({ serverUrl, appId});

  const fixURL = (url) => {
    if(url.startsWith("ipfs")){
      return "https://ipfs.moralis.io:2053/ipfs/"+url.split("ipfs://").pop()
    }
    else {
      return url+"?format=json"
    }
  };
  const fixImageURL = (url) => {
    if(url.startsWith("/ipfs")){
      return "https://ipfs.moralis.io:2053"+url
    }
    else {
      return url+"?format=json"
    }
  };


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
    
    setNft((previousNft) =>[{
      price: object.get("price"), 
      tokenId: object.get("tokenId"),
      owner: object.get("signerAddress"),
      publisher: object.get("buyerAddress").slice(-1)[0],
      createdAt: object.get("createdAt").toUTCString(),
      gallery: object.get("galleryAddress"),
      image: fixImageURL(meta.data.image),
      name: meta.data.name,
      description: meta.data.description,
      tokenURI: object.get("tokenURI"),
      lazy: true
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
                <Row class="d-flex" style={{paddingTop: "5px"}}>
                  <Col style={{fontWeight: "Bold"}}>Artist: ...{nft[0].owner.slice(30,43)}</Col>
                  <Col className="d-flex justify-content-end" style={{fontWeight: "Bold"}}>Owner: ...{nft[0].owner.slice(30,43)}</Col>
                </Row>
                <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <div style={{fontWeight: "Bold", fontSize: 60, paddingTop: 40}}>{nft[0].name}</div>
                        <div style={{fontWeight: "Bold", fontSize: 16}}>Minted on: {nft[0].createdAt}</div>
                        
                        <div style={{fontWeight: "Bold", fontSize: 30, paddingTop: 100, paddingBottom: 20}}><hr/>Description</div>
                        
                        <ListGroup style={{paddingBottom: 50}}>
                            <ListGroup.Item style={{fontSize: 16, paddingTop: 20, paddingBottom: 20}}>{nft[0].description}</ListGroup.Item>
                            <ListGroup.Item style={{fontWeight: "Bold", fontSize: 20, paddingTop: 20, display: "flex"}}>List Price: <img src={img} height="30" width="30"></img>{nft[0].price}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                    
                    <Col style={{marginLeft: "300px", paddingTop: 50}}>
                        
                        <ListGroup style={{paddingTop: "10px"}}>
                            <ListGroup.Item style={{fontWeight: "Bold"}}>Offers
                            <div>
                              Bid 1
                            </div>
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