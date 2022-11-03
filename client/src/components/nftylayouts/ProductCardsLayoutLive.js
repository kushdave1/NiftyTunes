import React from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";


import styled from 'styled-components'
import BandLayout from './BandLayout'
import { getEthPriceNow } from 'get-eth-price'
import { useMoralis, useNFTBalances } from "react-moralis"
import { useMoralisQuery } from "react-moralis";
//Bootstrap
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import FormGroup from 'react-bootstrap/FormGroup'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'
import xicon from '../../assets/images/xicon.png'
//custom
import NFTPlayer from '../nftymix/NFTPlayer'
import NFTPlayerModals from '../nftymix/NFTPlayerModals'
import NFTImage from '../nftymix/NFTImage'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'
import { FetchLiveTokenURI, FetchLiveOwner, FetchAuctionId } from '../nftyFunctions/FetchLiveTokenIds'

//Modals
import NFTModalNftyLive from '../nftyForms/NFTModalNftyLive'
import BidAcceptModal from '../nftyModals/BidModals/BidAcceptModal'
import BidLoadingModal from '../nftyModals/BidModals/BidLoadingModal'
import WithdrawLoadingModal from '../nftyModals/BidModals/WithdrawLoadingModal'

import { checkFileType } from '../nftyFunctions/checkFileType'

// functions
import StartAuction from '../nftymarketplace/StartAuction'

//solidity buttons
import BuyLazyNFTButton from '../nftySolidityButtons/BuyLazyNFTButton'
import BuyNFTButton from '../nftySolidityButtons/BuyNFTButton'
import ListNFTButton from '../nftySolidityButtons/ListNFTButton'
import DeListNFTButton from '../nftySolidityButtons/DeListNFTButton'
import StartAuctionButton from '../nftySolidityButtons/StartAuctionButton'
import EndAuctionButton from '../nftySolidityButtons/EndAuctionButton'
import UploadMetadataButton from '../nftySolidityButtons/UploadMetadataButton'
import BidLiveNFTButton from '../nftySolidityButtons/BidLiveNFTButton'

//loading skeleton
import Skeleton from "react-loading-skeleton";
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';
import Moralis from 'moralis';
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import { mintAndRedeem } from "../nftyFunctions/LazyFactoryAction"
import { BuyLazyNFT } from "../nftymarketplace/BuyLazyNFT"
import { BuyNFT } from "../nftymarketplace/BuyNFT"
import { useState, useEffect } from "react"
import img from "../../assets/images/ethereum.png"
import monkey from "../../assets/images/gorilla.png"
import LiveMintAuction from '../../contracts/LiveMint.sol/LiveMintAuction.json';
import { ConnectWallet } from "../nftyFunctions/ConnectWallet"
import { fixURL, fixImageURL } from '../nftyFunctions/fixURL'
import axios from 'axios';

import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function ProductCardsLayoutLive({index, owner, ownerName, ownerPhoto, artistName, artist, 
artistPhoto, collection, coverArt, name, description, nft, auctionAddress, 
editionsPerAuction, sold, nftFrom, auction, image, fileType}) {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

  const {isAuthenticated, user} = useMoralis();

  // const [image, setImage] = useState("")
  // const [fileType, setFileType] = useState("")

  // const handleNewImage = async() => {

  //   let image
  //   let tokenURI = ""

  //   try {
  //       tokenURI = await FetchLiveTokenURI( auction.mintAddress, auction.mintNumber, nft.tokenId, auction.coverArt, isAuthenticated )
  //   } catch (error) {
  //       console.log(error)
  //   }


  //   if (tokenURI !== "") {
  //     const meta = await axios.get(fixURL(tokenURI))
  //     for (const k in meta.data) {
  //         if ((meta.data[k]).toString().includes('ipfs')) {
  //             image = meta.data[k]
  //           }
  //     }
  //   } else {

  //     if (auction.tier === 'Legendary' && auction.Legendary !== undefined) {
  //         image = auction.Legendary
  //     } else if (auction.tier === 'Rare' && auction.Rare !== undefined ) {
  //         image = auction.Rare
  //     } else if (auction.tier === 'Common' && auction.Common !== undefined ) {
  //         image = auction.Common
  //     } else {
  //       image = auction.coverArt
  //     }

  //   }

  //   let fileType = await checkFileType(image)
  //   console.log(fileType, image, "DREAMs")

  //   setImage(image)
  //   setFileType(fileType)

  // }

  const [showBidModal, setShowBidModal] = useState(false)
  const [showBidLoadingModal, setShowBidLoadingModal] = useState(false)

  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false) 

  const [currentBid, setCurrentBid] = useState()
  const [bidAmount, setBidAmount] = useState()

  const [auctionTime, setAuctionTime] = useState()
  
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
  
  const [timeLeft, setTimeLeft] = useState()
  const [auctionTimeLeft, setAuctionTimeLeft] = useState("")

  const [bidSuccess, setBidSuccess] = useState(false)
  const [bidLoading, setBidLoading] = useState(true)
  const [bidError, setBidError] = useState(false)

  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(true)
  const [withdrawError, setWithdrawError] = useState(false)
  const [showWithdrawLoadingModal, setShowWithdrawLoadingModal] = useState(false)


  const handleShowBidModal = () => setShowBidModal(true)
  const handleCloseBidModal = () => setShowBidModal(false)

  const handleShowBidLoadingModal = () => setShowBidLoadingModal(true)
  const handleCloseBidLoadingModal = () => setShowBidLoadingModal(false)

  const handleShowWithdrawLoadingModal = () => setShowWithdrawLoadingModal(true)
  const handleCloseWithdrawLoadingModal = () => setShowWithdrawLoadingModal(false)

  const [ethPriceFinal, setEthPriceFinal] = useState()


  useEffect(async() => {
    // if (!nft.image) {
    //   await handleNewImage()
    // } else {
    //   setImage(nft.image)
    // 

    console.log(nft, "COWARD")

    
    
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
    <>
    {(nftFrom === "Artist") ? (
      <NFTCardRow>
        <Link to={`/live/${nft.signerAddress}/${nft.artistName}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Col xs={1} sm={3} lg={3} xl={3}>
            <Card
       className="live-card  bg-black"
                  style={{ width: '310px', height: '382px', border: "none", background: nftFrom === "Artist" ? "#F6A2B1" : "black", borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
                  { (fileType.toString().includes('png') || fileType.toString().includes('gif') || fileType.toString().includes('jpg') || 
                  fileType.toString().includes('jpeg') || fileType.toString().includes('usemoralis')) ? (<NFTImage output={image}/>) : 
                  (<NFTPlayer output={image}/>) }
                  <OwnerBox>
                    {(ownerPhoto) ? (<OwnerPhoto crossOrigin='true' crossoriginresourcepolicy='false' src={ownerPhoto}/>) : (<OwnerPhotoMissing />)}
                    <OwnerNameLabel>
                      <OwnerLabel>Owner</OwnerLabel>
                      <OwnerName>{(ownerName !== "") ? (ownerName) : (image.includes("ipfs")) ? (<>Unnamed</>) : (<>Not sold</>)}</OwnerName>
                    </OwnerNameLabel>
                  </OwnerBox>

                  <BandLayout nft={nft} /> 
                  <Card.Footer className="bg-pink px-0 mx-0" style={{paddingBottom: "51px", borderRadius: "0"}}>
                  </Card.Footer>          
            </Card>
        
        </Col>
        </Link>
      </NFTCardRow>

    ) : (
    <Col xs={1} sm={4} lg={4} xl={4}>
      <Link to={`/${nft.artistName}/${nft.name}`} style={{ textDecoration: 'none', pointerEvents: "auto"}}>
        <Card
        data-aos="fade-in"
      data-aos-offset="200"
      data-aos-delay="50"
      data-aos-duration="1000"
         className="live-card bg-black"
              style={{ width: '310px', height: '322px', border: "none", background: nftFrom === "Artist" ? "#F6A2B1" : "black", borderRadius:'.5rem .5rem 0 0', cursor: "pointer", overflow: "hidden"}} >
              { ((fileType.toString().includes('png') || fileType.toString().includes('gif') || fileType.toString().includes('jpg') || 
              fileType.toString().includes('jpeg') || fileType.toString().includes('usemoralis'))) ? (<NFTImage output={image}/>) : 
              (<NFTPlayerModals output={image}/>) }
              <OwnerBox>
                {(ownerPhoto) ? (<OwnerPhoto crossOrigin='true' crossoriginresourcepolicy='false' src={ownerPhoto}/>) : (<OwnerPhotoMissing />)}
                <OwnerNameLabel>
                  <OwnerLabel>Owner</OwnerLabel>
                  <OwnerName>{(ownerName !== "") ? (ownerName) : (image.includes("ipfs")) ? (<>Unnamed</>) : (<>Not sold</>)}</OwnerName>
                </OwnerNameLabel>
              </OwnerBox>

              <BandLayout nft={nft} />
               
        </Card>
      </Link>
    
    </Col>
    )}
    

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal} bidLoading={bidLoading} bidError={bidError} bidSuccess={bidSuccess} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} withdrawLoading={withdrawLoading} withdrawError={withdrawError} 
    withdrawSuccess={withdrawSuccess} handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} />
   
        
      
    </>
  )
}

export default ProductCardsLayoutLive

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

const OwnerBox = styled.div`
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 8px;

position: absolute;
width: 110px;
height: 30px;
left: 20px;
top: 21px;

`

const OwnerPhoto = styled.img`
width: 30px;
height: 30px;
border-radius: 153px;

`

const OwnerPhotoMissing = styled.img`
width: 30px;
height: 30px;
border-radius: 153px;
background: linear-gradient(180deg, #F6A2B1 0%, #9747FF 100%);

`

const OwnerNameLabel = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

width: 72px;
height: 29px;
`

const OwnerLabel = styled.div`
width: 30px;
height: 8px;

/* caption very small */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 8px;
line-height: 8px;
/* identical to box height, or 94% */

text-transform: uppercase;

/* white_transparent */

color: rgba(255, 255, 255, 0.5);
`

const OwnerName = styled.div`
width: 72px;
height: 15px;

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 15px;
/* identical to box height, or 91% */
white-space: nowrap;
display: flex;
align-items: flex-end;
text-transform: uppercase;

/* white */

color: #FFFFFF;
`