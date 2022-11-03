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



function ModalThree(props) {
    
    return (
       <Modal show={props.showThree} onHide={props.handleCloseThree} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Almost there! Please enter the # of NFT editions you'd like to give out per auction.
            </Modal.Title>
            
            <Form style={{padding: "30px"}}>
                <Row>
                    <Col>
                        
                        <center>
                            Auction ID
                        </center>

                    </Col>
                    <Col>
                        <center>
                            Number of NFTs to Mint
                        </center>
                    </Col>
                </Row>
                <hr/>
                {props.auctionArray.map((auction, i) => {
                    return(
                    <Row className="align-items-center">
                        <Col>
                            <center >
                                {auction}
                            </center>
                        </Col>
                        <Col>
                            <Form.Group controlId="nft.editions">
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Editions per Auction"
                                    className="mb-3"
                                >
                                <Form.Control 
                                    type="input"
                                    placeholder= '# of Editions'
                    
                                    onChange={props.updateNFTsPerAuction(auction)}/>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                    </Row> 
                    )
                })}
            
                {props.mintErrMessage &&
                        <Alert variant='danger'>
                        <i class="bi bi-radioactive"></i>
                        {'  '}{props.mintErrMessage}    
                    </Alert>
                }
 
                <Button variant="dark" style={{borderRadius: "2rem", float: "left"}} onClick={()=>{props.handleShowTwo();props.handleCloseThree()}}>
                    Back
                </Button>
                
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>props.handleGenerate()}>
                    Generate Contracts
                </Button>

     
            </Form>       
        </Modal>
    )
}

export default ModalThree