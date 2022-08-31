import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../../assets/images/xicon.png'
import nftyimg from '../../../assets/images/NT_White_Isotype.png'

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



function BidAcceptModal(props) {

    const { bidSuccess, setBidSuccess, bidError, setBidError, bidLoading, setBidLoading } = usePlaceBid()
    const [bidAmount, setBidAmount] = useState()

    return (
    <>
        <Modal show={props.showBidModal} onHide={props.handleCloseBidModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
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
        </Modal>
    </>
    )
}

export default BidAcceptModal