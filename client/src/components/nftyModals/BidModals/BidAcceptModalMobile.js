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



function BidAcceptModalMobile(props) {

    const { bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading } = usePlaceBid()
    const [bidAmount, setBidAmount] = useState()

    const minimumBid = parseFloat(props.lowestBid) + 0.005

    useEffect(() => {
        console.log(props.mintAddress, "CROP")

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
    {<Modal show={props.showBidModal} onHide={props.handleCloseBidModal} fullscreen={true} data-backdrop="false" style={{
        background: props.tier === "Rare" ? "#FD4758" : props.tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"
    }}>
        
        <XFull/>

            <BidBox>
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
                <BidTitle>Place your Bid</BidTitle>
                <YourBalance>Your balance: {props.balance} ETH</YourBalance>
                <InputBidSection> 
                    <InputBidETH>ETH</InputBidETH>
                    <InputBid placeholder={`Your Current Bid: ${props.currentBid}`}
                            value={bidAmount}
                            defaultValue={props.currentBid}
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
            </BidBox>
   
    </Modal>}
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

export default BidAcceptModalMobile



const BidModal = styled.div`
position: fixed;
width: 100%;
height: 100%;
z-index: 5;

`





const BidForm = styled.div`
position: absolute;
width: 310px;
height: 667px;


/* white */

background: #FFFFFF;
`

const BidBox = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 50px;

position: absolute;
width: 260px;
height: 465px;
left: 30px;
top: 101px;

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
left: 170px;
top: 60px;

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
width: 330px;
height: 0px;
top: 119.5px;

border: 1px solid rgba(0, 0, 0, 0.1);
`

const TopBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;

width: 110px;
height: 40px;

`

const TopBidText = styled.div`
width: 110px;
height: 16px;

/* small text */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 400;
font-size: 14px;
line-height: 16px;
/* identical to box height, or 114% */


color: #000000;
`

const TopBidNumber = styled.div`
width: 66px;
height: 18px;

/* Caption small */

font-family: 'Graphik LCG';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 18px;
/* identical to box height, or 112% */

white-space: nowrap;
text-transform: uppercase;

color: #000000;
`

const LowestBid = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
padding: 0px;
gap: 6px;
white-space: nowrap;
position: absolute;
width: 223px;
height: 40px;
top: 60px;

`

const BidTitle = styled.div`
position: absolute;
width: 34px;
height: 37px;
top: 221px;

/* H6 */

white-space: nowrap;

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

top: 268px;

/* small text */

font-family: 'Graphik LCG Regular';
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 16px;
/* identical to box height, or 114% */

white-space: nowrap;
color: #000000;
`

const InputBidSection = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 0px;
gap: 10px;

position: absolute;
width: 320px;
height: 80px;
top: 307px;
`

const InputBid = styled.input`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 10px 16px;
gap: 10px;

width: 320px;
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

width: 320px;
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