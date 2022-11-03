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
import CollectionImageLive from '../nftymix/CollectionImageLive'
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


import AOS from 'aos';
import 'aos/dist/aos.css';


 
function LiveCollectionLayout({collection, filterFinal}) {
  const [finalResult, setFinalResult] = useState(true)
  AOS.init();


  

  


  return (
    <>
    {finalResult && 
      <>
      {(filterFinal === "past") ? (
        <Col xs={1} md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`${collection.signerAddress}/${collection.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="shadow-md"
        
              style={{ width: '420px', height: '420px', borderRadius:'.50rem', marginBottom: "40px", cursor: "pointer", overflow: "hidden", backgroundImage: `url(${collection.cover})`}} >
                <CollectionImage output={collection.cover}/> 
                <PastTime/>
                <InfoBox>
                  <ConcertDate>
                    {collection.date}
                  </ConcertDate>
   
                  <ArtistName>{collection.name}
                  <Location>
                    {collection.location}
                  </Location>
                  </ArtistName>
                </InfoBox>
                <PastBottom/>
        </Card>
      </Link>
      </Col>
    ) : (filterFinal === "upcoming") ? (
      <Col xs={1} md={4} style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`${collection.signerAddress}/${collection.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="shadow-md"
        
              style={{ width: '420px', height: '420px', borderRadius:'.50rem', marginBottom: "40px", cursor: "pointer", overflow: "hidden", backgroundImage: `url(${collection.cover})`}} >
                <CollectionImage output={collection.cover}/> 
                <PastTime/>
                <InfoBox>
                  <ConcertDate>
                    {collection.date}
                  </ConcertDate>
   
                  <ArtistName>{collection.name}
                  <Location>
                    {collection.location}
                  </Location>
                  </ArtistName>
                </InfoBox>
                <PastBottom/>
        </Card>
      </Link>
      </Col>
    ) : (filterFinal === "live") ? (
      <Col xs={1} md={6} style={{ display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Link to={`${collection.signerAddress}/${collection.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card className="shadow-md"
              style={{ width: '640px', height: '420px', borderRadius:'.50rem', marginBottom: "40px", cursor: "pointer", overflow: "hidden", backgroundImage: `url(${collection.cover})`}} >
                <CollectionImageLive output={collection.cover}/> 
                <LiveTime/>
            
                <InfoBox>
                  
                  <ConcertDate>
                    <Ellipse/>Live: {collection.startTime} EST
                  </ConcertDate>
   
                  <ArtistNameLive>{collection.name}
                  <Location>
                    {collection.location}
                  </Location>
                  </ArtistNameLive>
                </InfoBox>
                <BottomShade/>
        </Card>
      </Link>
      </Col>
    ) : (<></>)}
    </>
  }
  </>
  )
}

export default LiveCollectionLayout

const Ellipse = styled.div`
width: 8px;
height: 8px;
border-radius: 2rem;
vertical-align: baseline;

/* fuchsia */

background: #FF007A;
`

const BottomShade = styled.div`

position: absolute;
width: 650px;
height: 125px;
left: 0px;
top: 305px;

background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
opacity: 0.3;
z-index: 0;
`

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

const InfoBoxLive = styled.div`
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
  top: 10px;

`

const LiveTime = styled.div`
position: absolute;
width: 650px;
height: 82px;
left: 0px;
top: 0px;

background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
opacity: 0.6;
`


const PastTime = styled.div`
position: absolute;
width: 420px;
height: 82px;
left: 0px;
top: 0px;

background: linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
opacity: 0.6;
`

const PastBottom = styled.div`
position: absolute;
width: 420px;
height: 202px;
left: 0px;
bottom: 0px;

background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
opacity: 0.6;
`


const NoLiveConcerts = styled.div`
width: 548px;
height: 27px;

/* Lead */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 27px;
/* identical to box height */


color: #000000;
`

const ConcertDate = styled.div`
gap: 10px;

width: 138px;
height: 31px;
/* H6 */
font-size: 30px;

font-family: 'Druk Cyr';

white-space: nowrap;

font-weight: 700;
/* identical to box height, or 37px */

letter-spacing: 0.01em;
text-transform: uppercase;

/* white */

color: #FFFFFF;
`

const ArtistName = styled.div`
/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 50px;
line-height: 57px;
/* identical to box height */

text-transform: uppercase;
z-index: 2;

/* white */

color: #FFFFFF;
`

const ArtistNameLive = styled.div`
/* H5 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 80px;
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