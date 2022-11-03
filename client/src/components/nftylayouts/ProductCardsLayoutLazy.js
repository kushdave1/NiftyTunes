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
  artistName, owner, ownerPhoto, ownerName, lazy, isSold, pageFrom, 
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
    <NFTCardRow>
    <Col xs={1} sm={3} lg={3} xl={3} style={{display: "flex"}}>
      {(isSold === false) ? (
      <Link to={`/lazy/${nft.artist}/${nft.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
      <Card className="bg-pink border-0"
              style={{ width: '310px', height: '382px', borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
              { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImage output={nft.image}/>) : 
              (nft.coverPhotoURL) ? (<NFTAudioPlayer output={nft.coverPhotoURL} audio={nft.image}/>) : (<NFTPlayer output={nft.image}/>) }
            
            
              <BandLayout nft={nft} />
              <Card.Footer className="bg-pink px-0 py-3 mx-0">
              <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <PriceCol>
                  {nft.price} ETH
                </PriceCol>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  <DollarPrice>
                  ${(nft.price!==undefined)?((ethPriceFinal * nft.price).toFixed(2)):(ethPriceFinal)}
                  </DollarPrice>
                </Col>
              </Row>
            </Card.Footer>

        </Card>
      </Link>
      ) : 
      (
      <Link to={`/${nft.tokenAddress}/${nft.tokenId}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
      <Card className="bg-black border-0"
              style={{ width: '310px', height: '382px', borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
              { (imageFile.toString().includes('png') || imageFile.toString().includes('gif') || imageFile.toString().includes('jpg') || 
              imageFile.toString().includes('jpeg') || imageFile.toString().includes('usemoralis')) ? (<NFTImage output={nft.image}/>) : 
              (nft.coverPhotoURL) ? (<NFTAudioPlayer output={nft.coverPhotoURL} audio={nft.image}/>) : (<NFTPlayer output={nft.image}/>) }
            
            
              <BandLayout nft={nft} />
              <Card.Footer className="bg-pink px-0 mx-0" style={{paddingBottom: "51px", borderRadius: "0"}}>
              {/* <Row className="d-flex flex-row align-items-center" style={{flexDirection:"column"}}> 
                <PriceCol>
                  {nft.price} ETH
                </PriceCol>
                <Col style={{justifyContent: 'right', display: "flex"}}>
                  
                  {(pageFrom!=="MyNFTs")?(<DollarPrice>${(ethPriceFinal* nft.price).toFixed(2)}</DollarPrice>):
                  (
                  <ListNFTButton nft={nft} handleShow={handleShow} handleSellClick={handleSellClick}/>
                  )}
                
                </Col>
              </Row> */}
            </Card.Footer>

        </Card>
      </Link>)}
        
    </Col>
    </NFTCardRow>
  )
}

export default ProductCardsLayoutLazy

const NFTCardRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 310px;
height: 382px;
flex-wrap: wrap;
`

const NFTCardCol = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;

width: 310px;
height: 382px;
`


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