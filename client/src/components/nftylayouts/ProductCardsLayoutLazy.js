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
import NFTImage from '../nftymix/NFTImage'

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { useState } from "react"
import img from "../../assets/images/ethereum.png"

import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";
 
function ProductCardsLayoutLazy({image, name, description, price, nft, owner}) {

  const [offerPrice, setOfferPrice] = useState(1);

  return (
    <Col xs={1} md={4}>
      <Link to={`/${owner}/${name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="bg-light shadow-sm"
              style={{ width: '25rem', height: '32.5rem', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden"}} >
              { (image.toString().includes('png') || image.toString().includes('gif')) ? (<NFTImage output={image}/>) : (<NFTPlayer output={image}/>) }
            
            <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <Card.Title className="text-dark" style={{fontSize: 16}}>{name}</Card.Title>
                        {/* <Card.Text className="text-dark">{description}</Card.Text> */}
                    </Col>
                    <Col>
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>{price}<img src={img} height="20" width="20"></img></Card.Title>
                    </Col>
                  
                </Row>
            </Card.Body>
            <Card.Footer className="bg-dark text-muted">
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}> 
                <Col>
                  <Button className="button-hover" variant="secondary" style={{ color: "white", background: "black", pointerEvents: "auto" }} onMouseEnter={changeBackground} onMouseOut={changeBackgroundBack} onClick={(e) => {BuyLazyNFT(nft); e.preventDefault();}}>Buy</Button>
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <img src={nftyimg} height="35" width="40"></img>
                </Col>
              </Row>
            </Card.Footer>
        </Card>
      </Link>
    </Col>
  )
}

export default ProductCardsLayoutLazy