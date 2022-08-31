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

//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import CollectionImage from '../nftymix/CollectionImage'
import CollectionBanner from '../nftymix/CollectionBanner'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'

//solidity buttons
import BuyLazyNFTButton from '../nftySolidityButtons/BuyLazyNFTButton'
import BuyNFTButton from '../nftySolidityButtons/BuyNFTButton'
import ListNFTButton from '../nftySolidityButtons/ListNFTButton'
import DeListNFTButton from '../nftySolidityButtons/DeListNFTButton'

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { BuyNFT } from "../nftymarketplace/BuyNFT"
import { useState } from "react"
import img from "../../assets/images/ethereum.png"
import monkey from "../../assets/images/gorilla.png"


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function LiveCollectionLayout({collection}) {

  const [offerPrice, setOfferPrice] = useState(1);

  return (
    <Col style={{paddingBottom:"20px", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`${collection.mintAddress}/${collection.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="bg-light shadow-md"
              style={{ width: '22.5rem', height: '20rem', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
                <CollectionBanner output={collection.banner}/>
                <CollectionImage output={collection.cover}/> 
            
            <Card.Body>

                <center>
                    <Card.Title className="text-dark" style={{fontSize: 16}}>{collection.name}</Card.Title>
                    <Card.Text style={{fontSize: 12, padding: "5px", color: "black"}}>{collection.description}</Card.Text>
                </center>
                
            </Card.Body>
              
            <Card.Footer className="bg-dark text-light">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {collection.date}
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <img src={nftyimg} height="22.5" width="26"></img>
                </Col>
              </Row>
            </Card.Footer> 
        </Card>
      </Link>
    </Col>
  )
}

export default LiveCollectionLayout