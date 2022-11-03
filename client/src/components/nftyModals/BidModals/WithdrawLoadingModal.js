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



function WithdrawLoadingModal(props) {

    const { withdrawSuccess, setWithdrawSuccess, withdrawError, setWithdrawError, withdrawLoading, setWithdrawLoading } = usePlaceBid()

    const XFull = () => {
        return (
            <div style={{cursor: "pointer", width: "25px", height: "25px"}} onClick={()=>props.handleCloseWithdrawLoadingModal()}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    const XFullSuccess = () => {
        return (
            <div style={{cursor: "pointer"}} onClick={()=>setWithdrawSuccess(false)}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }

    const XFullError = () => {
        return (
            <div style={{cursor: "pointer"}} onClick={()=>setWithdrawError(false)}>
                <XButton src={Vector23}/>
                <XButton2 src={Vector23}/>
            </div>
        )
    }
    
    return (
        <>
        {props.showWithdrawLoadingModal && withdrawLoading && <BidModal>
            <XFull/>
            <BidForm>
                <div class="snippet" data-title=".dot-flashing" style={{top: "90px"}}>
                    <div class="stage">
                        <div class="dot-flashing"></div>
                    </div>
                </div>
                <PlacingYourBid>
                    Withdrawing Your Bid...
                </PlacingYourBid>
            </BidForm>
        </BidModal>}

        {withdrawSuccess && <BidModal>
            <XFullSuccess/>
            <BidForm>
                <PlacingYourBid>
                    Your Bid is withdrawn.
                </PlacingYourBid>
            </BidForm>
        </BidModal>}

        {withdrawError && <BidModal>
            <XFullError/>
            <BidForm>
                <PlacingYourBid>
                    Your Withdraw failed.
                    
                </PlacingYourBid>
                <div style={{fontSize: 12, top: "300px", left: "85px", width: "75%", position: "absolute", justifyContent: "center", alignSelf: "center"}}>
                If your bid is in the money "ITM", your bid is locked in and cannot be withdrawn unless you are outbid (Bid will become Out of the money "OTM").
                </div>
            </BidForm>
        </BidModal>}
        </>
    //     <Modal show={props.showWithdrawLoadingModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable' >
    //         <Modal.Header style={{backgroundColor: "black"}} >
    //             <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
    //         </Modal.Header>
    //         <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
    //             Withdrawing your bid!
    //         </Modal.Title>
    //         <Row style={{padding: "30px 30px 30px 30px"}}>
    //             <Col sm={7} className="align-self-center">
    //                 <div>
    //                 <h4 className="text-start fw-bold mb-0">Withdrawing the <span className="text-primary">Live </span>Bid</h4>
    //                 <small className='text-muted'>This should only take a minute</small>
    //                 </div>
    //             </Col>
    //             <Col sm={5} className="align-self-center">
                    
    //                 {(withdrawLoading) ? (<center className="spinner-container">
    //                     <div className="loading-spinner">
    //                     </div>
    //                 </center>) : (withdrawError) ? (<center>
    //                     <img src={error} width="50px" height="50px"></img>
    //                 </center>) : (<center>
    //                     <img src={checkmark} width="50px" height="50px"></img>
    //                 </center>)}
                   
    //             </Col>
                
    //         </Row>
    //         {withdrawSuccess &&
    //             <Alert variant='success' className="py-1">
    //             <i class="bi bi-check-circle-fill"></i>
    //             {' '} Congratulations! Your Withdrawal has been successful!
    //             <Alert.Link onClick={() => props.handleCloseWithdrawLoadingModal()}>Go back to Auction Console</Alert.Link>
    //             </Alert>
    //         }
    //         {withdrawError && 
    //           <Alert variant='danger' >
    //             <i class="bi bi-check-circle-fill"></i>
    //             {' '} Your transaction failed
    //             <Alert.Link onClick={() => props.handleCloseWithdrawLoadingModal()}><br />Go back to Auction Console</Alert.Link>
    //             </Alert>

    //         }
    //   </Modal>
    )
}

export default WithdrawLoadingModal


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
left: 202px;
top: 160px;

`

const PlacingYourBid = styled.div`

position: absolute;
width: 195px;
height: 37px;
left: 184px;
top: 223px;

white-space: nowrap;
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
left: 240px;
top: 160px;

`