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
import { useState , useEffect} from "react"
import img from "../../assets/images/ethereum.png"
import monkey from "../../assets/images/gorilla.png"
import styled from 'styled-components'



import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function LiveCollectionLayout({collection, filterFinal}) {
  const [finalResult, setFinalResult] = useState(true)
  

  


  return (
    <>
    {finalResult && 
      <Col xs={1} md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`${collection.mintAddress}/${collection.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="bg-light shadow-md"
              style={{ width: '420px', height: '420px', borderRadius:'.50rem', cursor: "pointer", overflow: "hidden", backgroundImage: `url(${collection.cover})`}} >
                <CollectionImage output={collection.cover}/> 
                <InfoBox>
     
                  <ConcertDate>
                    {collection.date}
                  </ConcertDate>
   
                  <ArtistName>{collection.name}
                  <Location>
                    {collection.description}
                  </Location>
                  </ArtistName>
                </InfoBox>
            

        </Card>
      </Link>
    </Col>}
</>
  )
}

export default LiveCollectionLayout

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  gap: 266px;

  position: absolute; 
  width: 380px;
  height: 376px;
  left: 20px;
  top: 25px;

`

const ConcertDate = styled.div`
width: 168px;
height: 37px;

/* H6 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 700;
font-size: 36px;
/* identical to box height, or 37px */

letter-spacing: 0.01em;
text-transform: uppercase;

/* white */

color: #FFFFFF;
`
const ArtistName = styled.div`
/* H5 */

font-family: 'Druk Cyr';
font-style: italic;
font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;

/* white */

color: #FFFFFF;
`



const Location = styled.div`
width: 340px;
height: 36px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 16px;
/* or 112% */

display: flex;
align-items: flex-end;
text-transform: uppercase;

/* white */

color: #FFFFFF;
`