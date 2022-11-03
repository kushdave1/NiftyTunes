import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../../assets/images/xicon.png'
import nftyimg from "../../../assets/images/NT_White_Isotype.png";
import checkmark from "../../../assets/images/checkmark.png"
import error from '../../../assets/images/error.png'

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

import legendaryband from '../../../assets/images/legendaryband.png'
import { usePlaceBid } from "../../../providers/PlaceBidProvider/PlaceBidProvider";
import Vector23 from '../../../assets/images/Vector 23.png'




function BidLoadingModalMobile(props) {

    const { bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading } = usePlaceBid()

    const handleShowBidSuccessModal = () => setBidSuccess(true)
    const handleCloseBidSuccessModal = () => setBidSuccess(false)

    const handleShowBidErrorModal = () => setBidError(true)
    const handleCloseBidErrorModal = () => setBidError(false)

    const XFull = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px"}} onClick={()=>props.handleCloseBidLoadingModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    const XFullSuccess = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px", zIndex: "5"}} onClick={()=>handleCloseBidSuccessModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    const XFullError = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px", zIndex: "5"}} onClick={()=>handleCloseBidErrorModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    return (
    <>
        {props.showBidLoadingModal && bidLoading && 
        <Modal show={props.showBidLoadingModal} onHide={props.handleCloseBidLoadingModal} data-backdrop="false" fullscreen={true} style={{
        background: props.tier === "Rare" ? "#FD4758" : props.tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"
    }}>
            <XFull/>
            <BidForm>
                <LoadingButtons>
                <div class="snippet" data-title=".dot-flashing" style={{top: "90px"}}>
                    <div class="stage">
                        <div class="dot-flashing"></div>
                    </div>
                </div>
                </LoadingButtons>
                <PlacingYourBid>
                    Placing Your Bid...
                </PlacingYourBid>
            </BidForm>
        </Modal>}

        {bidSuccess && <Modal show={bidSuccess} onHide={handleCloseBidSuccessModal} fullscreen={true} style={{
        background: props.tier === "Rare" ? "#FD4758" : props.tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"
    }}>
            <XFullSuccess/>
            <BidForm>
                <PlacingYourBid>
                    Your Bid is Placed Successfully.
                </PlacingYourBid>
            </BidForm>
        </Modal>}

        {bidError && <Modal show={bidError} onHide={handleCloseBidErrorModal} fullscreen={true} style={{
        background: props.tier === "Rare" ? "#FD4758" : props.tier === "Legendary" ? `url(${legendaryband})`: "#EDCF92"
    }}>
            <XFullError/>
            <BidForm>
                <PlacingYourBid>
                    Your Bid failed.

                    
                </PlacingYourBid>
                <div style={{fontSize: 16, top: "500px", left: "45px", width: "50%", position: "absolute", justifyContent: "center", alignSelf: "center"}}>
                You likely have not connected your wallet or are not bidding high enough. 
                    
         
                    Make sure you have enough ETH in your wallet.
                </div>
            </BidForm>
        </Modal>}

        {/* <Modal show={props.showBidLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Placing your Bid!
            </Modal.Title>
            <Row style={{padding: "30px 30px 30px 30px"}}>
                <Col sm={7} className="align-self-center">
                    <div>
                    <h4 className="text-start fw-bold mb-0">Placing the <span className="text-primary">Live </span><br/>Bid</h4>
                    <small className='text-muted'>This should only take a minute</small>
                    </div>
                </Col>
                <Col sm={5} className="align-self-center">
                    
                    {(bidLoading) ? (<center className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </center>) : (bidError) ? (<center>
                        <img src={error} width="50px" height="50px"></img>
                    </center>) : (<center>
                        <img src={checkmark} width="50px" height="50px"></img>
                    </center>)}
                   
                </Col>
                
            </Row>
            {bidSuccess &&
                <Alert variant='success' className="py-1">
                <i class="bi bi-check-circle-fill"></i>
                {' '} Congratulations! Your bid has been placed!
                <Alert.Link onClick={() => props.handleCloseBidLoadingModal()}>{' '} Go back to Auction Console</Alert.Link>
                </Alert>
            }
            {bidError && 
              <Alert variant='danger' >
                <i class="bi bi-check-circle-fill"></i>
                {' '} Your transaction failed
                <Alert.Link onClick={() => props.handleCloseBidLoadingModal()}><br />{' '} Go back to Auction Console</Alert.Link>
                </Alert>

            }
      </Modal> */}

    </>
    )
}

export default BidLoadingModalMobile


const BidModal = styled.div`
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

const BidLoadingSquare = styled.div`
position: absolute;
width: 195px;
height: 100px;
left: 58px;
top: 274px;

`

const PlacingYourBid = styled.div`

position: absolute;
width: 195px;
height: 37px;
left: 58px;
top: 337px;

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


const LoadingButtons = styled.div`

display: flex;
flex-direction: row;
justify-content: space-between;
align-items: flex-start;
padding: 0px;
gap: 4px;

position: absolute;
width: 102px;
height: 24px;
left: 96px;
top: 274px;

`