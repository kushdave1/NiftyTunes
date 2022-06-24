import React from 'react'

//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'

//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import NFTImage from '../nftymix/NFTImage'

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
//import BuyNFT from "../nftymarketplace/BuyNFT"
//import { BidNFT } from "../nftymarketplace/BidNFT"
import { useState, useEffect } from "react"
import img from "../../assets/images/ethereum.png"

import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import nftyimg from "../../assets/images/NT_White_Isotype.png";


const decimalPlaces = 5;


 
function ProductCardsLayoutMixer({image, tokenAddress, tokenId, name, description, price, nft, owner}) {

  const [offerPrice, setOfferPrice] = useState(1);

  const { marketAddress, marketContractABI, wethAddress, wethContractABI } = useMoralisDapp();


  return (
      <Card className="bg-light shadow-md p-0" onClick={() => console.log('clicked')}
            style={{ width: '22.5rem', height: '30rem', borderRadius:'2.00rem', cursor: "pointer", overflow: "hidden"}} tokenaddress={tokenAddress} tokenid={tokenId}>
            { (image.toString().includes('png') || image.toString().includes('gif')) ? (<NFTImage output={image}/>) : (<NFTPlayer output={image}/>) }
          
          <Card.Body>
            <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                  <Col>
                      <Card.Title className="text-dark" style={{fontSize: 14}}>{name}</Card.Title>
                      {/* <Card.Text className="text-dark">{description}</Card.Text> */}
                  </Col>
                  <Col>
                      <Card.Title className="text-dark" style={{fontSize: 14, justifyContent: 'right', display: "flex"}}>{price}<img src={img} height="25" width="25"></img></Card.Title>
                  </Col>
                
              </Row>
          </Card.Body>
          <Card.Footer className="bg-dark text-muted">
          <Row className="d-flex flex-row no-gutters" style={{flexDirection:"column"}}> 
            {/* <Col>
              <Button className="button-hover" variant="secondary" style={{ color: "white", background: "black" }} onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} onClick={() => BuyNFT(nft)}>Buy</Button>
            </Col> */}
            <Col style={{justifyContent: 'right', display: "flex"}}>
              <img src={nftyimg} height="35" width="40"></img>
            </Col>
          </Row>
          </Card.Footer>
      </Card>

  )
}

export default ProductCardsLayoutMixer