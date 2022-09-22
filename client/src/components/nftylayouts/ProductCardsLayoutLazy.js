import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";

//Bootstrap
import styled from 'styled-components'
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
import { useIPFS } from '../../hooks/useIPFS'
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { BuyNFT } from "../nftymarketplace/BuyNFT"
import { useState, useEffect } from "react"
import img from "../../assets/images/ethereum.png"
import monkey from "../../assets/images/gorilla.png"


import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";
import BandLayout from './BandLayout'
import { getEthPriceNow } from 'get-eth-price'

 
function ProductCardsLayoutLazy({
  image, name, description, price, nft, artist, artistPhoto, 
  artistName, owner, ownerPhoto, ownerName, lazy, pageFrom, 
  handleShow, handleSellClick, coverPhotoURL, nftyLazyFactoryAddress,
  marketAddress, marketContractABIJson, tokenId, tokenAddress, fileType
  }) {

  const [offerPrice, setOfferPrice] = useState(1);
  const [imageFile, setImageFile] = useState(nft.fileType)
  const { resolveLink } = useIPFS()
  const [ethPriceFinal, setEthPriceFinal] = useState()

  useEffect(async() => {
    await getEthPrice()
  }, [])

  const getEthPrice = async() => {
    const eth = await getEthPriceNow()
    // const ethPrice = eth[Date()]
    let ethPrice
    for (const i in eth) {
      ethPrice = eth[i]['ETH']['USD']
    }
    const finalPrice = parseFloat(ethPrice)
    setEthPriceFinal(finalPrice)
  }

  return (
    <Col xs={1} md={3} style={{display: "flex"}}>
      {(lazy) ? (
      <Link to={`/lazy/${nft.artist}/${nft.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
      <Card className="bg-pink border-0 "
              style={{ width: '310px', height: '382px', borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
              { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImage output={nft.image}/>) : 
              (nft.coverPhotoURL) ? (<NFTAudioPlayer output={nft.coverPhotoURL} audio={nft.image}/>) : (<NFTPlayer output={nft.image}/>) }
            
            {/* <Card.Body>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 16}}>{nft.name}</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>{nft.price}
                        <img src={img} height="20" width="20"></img></Card.Title>
                    </Col>
              </Row>
              <br></br>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        {(nft.artistPhoto) ? (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={nft.artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>) :
                        (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={monkey} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>)} 
                        @{nft.artistName}</Card.Text>
                    </Col>
              </Row>

            </Card.Body> */}
            <BandLayout nft={nft}/>
            <Card.Footer>
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <PriceCol>
                  {nft.price} ETH
                </PriceCol>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <DollarPrice>
                    ${(ethPriceFinal * nft.price).toFixed(2)}
                  </DollarPrice>
                </Col>
              </Row>
            </Card.Footer>
            {/* <Card.Footer className="bg-dark text-muted">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {(pageFrom==="Explore") ? ((nft.lazy) ? (<BuyLazyNFTButton nft={nft} nftyLazyFactoryAddress={nftyLazyFactoryAddress}></BuyLazyNFTButton>) 
                  : (<BuyNFTButton nft={nft} marketAddress={marketAddress} marketContractABIJson={marketContractABIJson}></BuyNFTButton>)) 
                  : ((pageFrom==="MyNFTs") ? (<ListNFTButton nft={nft} handleShow={handleShow} handleSellClick={handleSellClick}></ListNFTButton>) 
                  : (<DeListNFTButton nft={nft} handleShow={handleShow} handleSellClick={handleSellClick}></DeListNFTButton>))}
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <img src={nftyimg} height="35" width="40"></img>
                </Col>
              </Row>
            </Card.Footer> */}
        </Card>
      </Link>
      ) : 
      (
      <Link to={`/${nft.tokenAddress}/${nft.tokenId}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
      <Card className="bg-pink border-0"
              style={{ width: '310px', height: '382px', borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
              { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImage output={nft.image}/>) : 
              (nft.coverPhotoURL) ? (<NFTAudioPlayer output={nft.coverPhotoURL} audio={nft.image}/>) : (<NFTPlayer output={nft.image}/>) }
            
              {/* <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col sm={8}>
                        <Card.Title className="text-dark truncate" style={{fontSize: 16}}>{nft.name}</Card.Title>
                    </Col>
                    <Col sm={4}>
                        <Card.Title className="text-dark" style={{fontSize: 16, justifyContent: 'right', display: "flex"}}>{nft.price}
                        <img src={img} height="20" width="20"></img></Card.Title>
                    </Col>
              </Row>
              <br></br>
              <Row className="d-flex flex-row" style={{flexDirection:"column"}}>
                    <Col>
                        <Card.Text className="text-dark" style={{fontSize: 12}}>
                        {(nft.artistPhoto) ? (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={nft.artistPhoto} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>) :
                        (<img style={{display: "inline", borderRadius:'2.0rem'}} 
                        src={monkey} crossOrigin='true' crossoriginresourcepolicy='false' height="20" width="20"></img>)} 
                         {nft.artistName}</Card.Text>
                    </Col>
              </Row> */}
              <BandLayout nft={nft} />
              <Card.Footer className="bg-pink px-0 py-3 mx-0">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <PriceCol>
                  {nft.price} ETH
                </PriceCol>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <DollarPrice>
                  ${(ethPriceFinal * nft.price).toFixed(2)}
                  </DollarPrice>
                </Col>
              </Row>
            </Card.Footer>

            {/* <Card.Footer className="bg-dark text-muted">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <Col>
                  {(pageFrom==="Explore") ? ((nft.lazy) ? (<BuyLazyNFTButton nft={nft} nftyLazyFactoryAddress={nftyLazyFactoryAddress}></BuyLazyNFTButton>) 
                  : (<BuyNFTButton nft={nft} marketAddress={marketAddress} marketContractABIJson={marketContractABIJson}></BuyNFTButton>)) 
                  : ((pageFrom==="MyNFTs") ? (<ListNFTButton nft={nft} handleShow={handleShow} handleSellClick={handleSellClick}></ListNFTButton>) 
                  : (<DeListNFTButton nft={nft} handleShow={handleShow} handleSellClick={handleSellClick}></DeListNFTButton>))}
                </Col>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <img src={nftyimg} height="35" width="40"></img>
                </Col>
              </Row>
            </Card.Footer> */}
        </Card>
      </Link>)}
        
    </Col>
  )
}

export default ProductCardsLayoutLazy


const PriceCol = styled(Col)`
width: 180px;
height: 32px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 32px;
line-height: 32px;
/* identical to box height */
white-space: nowrap;
overflow: hidden;


color: #000000;

`

const DollarPrice = styled.div`
width: 56px;
height: 27px;

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 24px;
/* or 120% */
white-space: nowrap;
overflow: hidden;

color: #000000;

opacity: 0.6;
`