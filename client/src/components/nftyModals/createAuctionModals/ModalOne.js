import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../../assets/images/xicon.png'
import nftyimg from "../../../assets/images/NT_White_Isotype.png";

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



function ModalOne(props) {
    
    return (
        <Modal show={props.show} onHide={props.handleClose} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Enter Details for your Live Mint!
            </Modal.Title>
            <Form style={{padding: "30px"}}>
                <Form.Group className="mb-3" controlId="nft.galleryName">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Name"
                        
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Name'
                        value={props.galleryName}
                        onChange={e => props.setGalleryName(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.gallerySymbol">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Symbol"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Symbol'
                        value={props.gallerySymbol}
                        onChange={e => props.setGallerySymbol(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.location">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Location"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Location'
                        value={props.location}
                        onChange={e => props.setLocation(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.stream">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Stream Link"
                        className="mb-3"
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Enter Live Stream Link'
                        value={props.stream}
                        onChange={e => props.setStream(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.royalty">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Royalty %"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Enter Royalty %'
                                value={props.royalty}
                                onChange={e => props.setRoyalty(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.auctionNumber">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="# of Auctions"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= '# of Auctions'
                                value={props.mintNumber}
                                onChange={e => props.setMintNumber(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <div className='d-flex justify-content-center m-1'>
                    <small className='text-dark'>Cover Art (Shown before NFT Metadata is Inserted)</small>
                </div>
                <div className='d-flex justify-content-center p-2'>
                    <Form.Group controlId = "uploadPhotoFile" style={{width: 275}}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload Cover Art" 
                            onChange={(e) => {
                                try {
                                    props.setCoverArt(e.target.files?.item(0))
                                } catch {
                                    props.setMintErrMessage("Please submit .png .gif files only")
                                }
                            }}

                        />
                    </Form.Group>

                </div>
                <div className='d-flex justify-content-center m-1'>
                    <small className='text-dark'>Banner Image</small>
                </div>
                <div className='d-flex justify-content-center p-2'>
                    <Form.Group controlId = "uploadPhotoFile" style={{width: 275}}>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload Banner Image" 
                            onChange={(e) => {
                                try {
                                    props.setBannerImage(e.target.files?.item(0))
                                } catch {
                                    props.setMintErrMessage("Please submit .png .gif files only")
                                }
                                }}
                        />
                    </Form.Group>

                </div>
                {props.mintErrMessage &&
                        <Alert variant='danger'>
                        <i class="bi bi-radioactive"></i>
                        {'  '}{props.mintErrMessage}    
                    </Alert>
                }
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{props.handleNext();}}>
                    Next
                </Button>

            </Form>       
        </Modal>
    )
}

export default ModalOne