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
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

import live from "../../assets/images/liveTwo.png"
import checkmark from "../../assets/images/checkmark.png"
import error from '../../assets/images/error.png'

import BandLayout from './BandLayout'

//custom
import NFTPlayer from '../nftymix/NFTPlayerMobile'
import NFTImage from '../nftymix/NFTImage'
import NFTAudioPlayer from '../nftymix/NFTAudioPlayer'

//Modals
import NFTModalNftyLive from '../nftyForms/NFTModalNftyLive'
import BidAcceptModal from '../nftyModals/BidModals/BidAcceptModal'
import BidLoadingModal from '../nftyModals/BidModals/BidLoadingModal'
import WithdrawLoadingModal from '../nftyModals/BidModals/WithdrawLoadingModal'

// functions
import StartAuction from '../nftymarketplace/StartAuction'

import styled from 'styled-components'

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



import { changeBackground, changeBackgroundBack } from "../nftyFunctions/hover"
import Countdown from "../nftyFunctions/CountdownTimer"

import nftyimg from "../../assets/images/NT_White_Isotype.png";


 
function ProductCardsLayoutLiveMobile({index, owner, ownerName, ownerPhoto, artistName, artist, artistPhoto, collection, image, coverArt, name, 
description, nft, auctionAddress, editionsPerAuction, sold, fileType, nftFrom}) 

  {

  const defaultRemainingTime = {
    seconds: '00',
    minutes: '00',
    hours: '00'
  }

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

  

  return (
    <>
    {(nftFrom === "Artist") ? (
      <NFTCardRow>
        <Card className="live-card bg-black" 
              style={{ width: '310px', height: '322px', border: "none", background: nftFrom === "Artist" ? "#F6A2B1" : "black", borderRadius:'10px 10px 0 0', cursor: "pointer", overflow: "hidden",
               }} >
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
              <Card.Footer className="bg-pink px-0 mx-0 border-right-0 border-left-0" style={{paddingBottom: "20px", borderRadius: "0"}}>
              </Card.Footer>      
        </Card>
    
      </NFTCardRow>
    ) : (
      <NFTCardRow>
        <Card className="live-card bg-black" 
        data-aos="fade-in"
    data-aos-offset="200"
    data-aos-delay="200"
    data-aos-duration="1000"
              style={{ width: '310px', height: '322px', border: "none", background: nftFrom === "Artist" ? "#F6A2B1" : "black", borderRadius:'10px 10px 0 0', cursor: "pointer", overflow: "hidden",
               }} >
              { (fileType.toString().includes('png') || fileType.toString().includes('gif') || fileType.toString().includes('jpg') || 
              fileType.toString().includes('jpeg') || fileType.toString().includes('usemoralis')) ? (<NFTImage output={image}/>) : 
              (<NFTPlayer output={image} nftFrom="Collection"/>) }
              <OwnerBox>
                {(ownerPhoto) ? (<OwnerPhoto crossOrigin='true' crossoriginresourcepolicy='false' src={ownerPhoto}/>) : (<OwnerPhotoMissing />)}
                <OwnerNameLabel>
                  <OwnerLabel>Owner</OwnerLabel>
                  <OwnerName>{(ownerName !== "") ? (ownerName) : (image.includes("ipfs")) ? (<>Unnamed</>) : (<>Not sold</>)}</OwnerName>
                </OwnerNameLabel>
              </OwnerBox>

              <BandLayout nft={nft} />      
            
        </Card>
    
      </NFTCardRow>
    )
      
    }

    <BidAcceptModal showBidModal={showBidModal} handleCloseBidModal={handleCloseBidModal} currentBid={currentBid}
     handleShowBidLoadingModal={handleShowBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <BidLoadingModal showBidLoadingModal={showBidLoadingModal} bidLoading={bidLoading} bidError={bidError} bidSuccess={bidSuccess} 
    handleCloseBidLoadingModal={handleCloseBidLoadingModal} auctionAddress={auctionAddress}/>
    
    <WithdrawLoadingModal showWithdrawLoadingModal={showWithdrawLoadingModal} withdrawLoading={withdrawLoading} withdrawError={withdrawError} 
    withdrawSuccess={withdrawSuccess} handleCloseWithdrawLoadingModal={handleCloseWithdrawLoadingModal} />
   
        
      
    </>
  )
}

export default ProductCardsLayoutLiveMobile


const NFTCardRow = styled.div`
display: flex;
flex-direction: row;
align-items: flex-start;
padding: 0px;
gap: 10px;

width: 340px;
height: 322px;

border-radius: 10px 10px 0px 0px;
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