import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../../assets/images/xicon.png'
import nftyimg from '../../../assets/images/NT_White_Isotype.png'




import legendaryband from '../../../assets/images/legendaryband.png'

import Container from 'react-bootstrap/Container'
import styled from 'styled-components'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Alert from 'react-bootstrap/Alert'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'

import { usePlaceBid } from "../../../providers/PlaceBidProvider/PlaceBidProvider";
import { PlaceBid } from "../../nftyFunctions/PlaceBid"
import Vector23 from '../../../assets/images/Vector 23.png'



function BidAcceptModal(props) {

    const { bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading } = usePlaceBid()
    const [bidAmount, setBidAmount] = useState()

    const minimumBid = parseFloat(props.lowestBid) + 0.005

    useEffect(() => {
        console.log(props.mintAddress, "FEAR")

    }, [props.showBidModal])
    


    const XFull = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px"}} onClick={()=>props.handleCloseBidModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    return (
    <>
    {props.showBidModal && <BidModal style={{
        background: props.tier === "Rare" ? "#FD4758" : props.tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"
    }}>
        <XFull/>
        <BidForm>
            <TopBid>
                <TopBidText>Top Bid:</TopBidText>
                {(props.highestBid) ? (<TopBidNumber>{props.highestBid} ETH</TopBidNumber>) : (<TopBidNumber>0.00 ETH</TopBidNumber>)}
            </TopBid>
            <LowestBid>
                <TopBidText>Lowest Winning Bid:</TopBidText>
                {(props.lowestBid) ? (<TopBidNumber>{props.lowestBid} ETH</TopBidNumber>) : (<TopBidNumber>0.00 ETH</TopBidNumber>)}
            </LowestBid>
            <MinimumBid>
                <TopBidText>
                Floor Bid:</TopBidText>
                {(props.tier === "Legendary") ? (<TopBidNumber>{props.auction.floors[0]} ETH</TopBidNumber>) : 
                (props.tier === "Rare") ? (<TopBidNumber>{props.auction.floors[1]} ETH</TopBidNumber>) : (<TopBidNumber>{props.auction.floors[2]} ETH</TopBidNumber>) }
            </MinimumBid>
            <Divider/>
            <BidTitle>Bid</BidTitle>
            <YourBalance>Your balance: {props.balance} ETH</YourBalance>
            <InputBidSection>
                <InputBidETH>ETH</InputBidETH>
                <InputBid placeholder={`Your Current Bid: ${props.currentBid}`}
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}/>
                
                <PlaceBidButton onClick={()=>{props.handleCloseBidModal();
                    props.handleShowBidLoadingModal();
                    PlaceBid(bidSuccess, setBidSuccess, bidError, 
                    setBidError, bidLoading, setBidLoading, bidAmount, 
                    props.auctionAddress, props.mintAddress)}}>
                        
                    <PlaceBidText>
                    Place bid
                    </PlaceBidText>
                </PlaceBidButton>
            </InputBidSection>
        </BidForm>
    </BidModal>}
        {/* <Modal show={props.showBidModal} onHide={props.handleCloseBidModal} style={{background: `url(${legendaryband})`}} 
        dialogClassName="modal-dialog-centered">
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                How much would you like to bid on this NFT for? 
                
            
                <div style={{paddingTop: "10px", fontSize: 14}}>
                Your Current Bid {props.currentBid} ETH
                </div>
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="nft.bidAmount">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Price (ETH)"
                        style={{width: "150px"}}
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Price (ETH)'
                        
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}/>
                        
                    </FloatingLabel>
                </Form.Group>
                <Button variant="dark" style={{borderRadius: "2rem", float: "right", width: "100px"}} 
                onClick={()=>{props.handleCloseBidModal();props.handleShowBidLoadingModal();PlaceBid(bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading, bidAmount, props.auctionAddress)}}>
                    Place Bid
                </Button>
            </Form>      
        </Modal> */}




    </>
    )
}

export default BidAcceptModal


const BidModalLegendary = styled.div`
position: fixed;
width: 670px;
height: 470px;
background-image: url(${legendaryband});
z-index: 2;
left: 30%;
top: 25%;
`

const BidModal = styled.div`
position: fixed;
width: 670px;
height: 470px;
z-index: 2;
left: 30%;
top: 25%;
`

const BidModalRare = styled.div`
position: fixed;
width: 670px;
height: 470px;
background-color: #FD4758;
z-index: 2;
left: 30%;
top: 25%;
`

const BidModalCommon = styled.div`
position: fixed;
width: 670px;
height: 470px;
background-image: url(${legendaryband});
z-index: 2;
left: 30%;
top: 25%;
`

const BidForm = styled.div`
position: absolute;
width: 600px;
height: 470px;
left: 0px;
top: 0px;

/* white */

background: #FFFFFF;
`


const XButton = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
`

const XButton2 = styled.img`
    position: absolute;
    width: 24px;
    height: 24px;
    right: 24px;
    top: 24px;
    transform: rotate(-90deg);
`

const Divider = styled.div`
position: absolute;
width: 450px;
height: 0px;
left: 70px;
top: 119.5px;

border: 1px solid rgba(0, 0, 0, 0.1);
`

const TopBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

position: absolute;
width: 110px;
height: 40px;
left: 70px;
top: 60px;

`

const TopBidText = styled.div`
width: 200px;
height: 16px;

/* small text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 16px;
/* identical to box height, or 114% */


color: #000000;
`

const TopBidNumber = styled.div`
width: 100px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

text-transform: uppercase;

color: #000000;
`

const LowestBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

position: absolute;
width: 223px;
height: 40px;
left: 201px;
top: 60px;

`

const MinimumBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

position: absolute;
width: 223px;
height: 40px;
left: 380px;
top: 60px;

`

const BidTitle = styled.div`
position: absolute;
width: 34px;
height: 37px;
left: 70px;
top: 160px;

/* H6 */

font-family: 'Druk Cyr';

font-weight: 700;
font-size: 36px;
line-height: 101.8%;
/* identical to box height, or 37px */

letter-spacing: 0.01em;
text-transform: uppercase;

color: #000000;
`

const YourBalance = styled.div`
position: absolute;
width: 159px;
height: 16px;
left: 363px;
top: 178px;

/* small text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 16px;
/* identical to box height, or 114% */


color: #000000;
`

const InputBidSection = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 10px;

position: absolute;
width: 450px;
height: 110px;
left: 70px;
top: 217px;
`

const InputBid = styled.input`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 10px 16px;
gap: 10px;

width: 450px;
height: 44px;

/* light gray */

background: #F0F0F0;
border-radius: 32px;
`

const InputBidETH = styled.div`
width: 39px;
height: 15px;
position: absolute;
top: 15px;
right: 20px;

/* Caption */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 15px;
/* identical to box height, or 73% */

text-transform: uppercase;

/* black */

color: #000000;
`
const PlaceBidButton = styled.button`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 20px 38px;
gap: 10px;

width: 450px;
height: 44px;

background: #000000;
border-radius: 30px;

`

const PlaceBidText = styled.div`
width: 71px;
height: 16px;

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 16px;
/* identical to box height */


color: #FFFFFF;
`