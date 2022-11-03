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



function ModalTwo(props) {
    
    return (
        <Modal show={props.showTwo} onHide={props.handleCloseTwo} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <img style={{float: "right"}} height="27.5px" width="32.5px" src={nftyimg}></img>
            </Modal.Header>
            <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
                Almost Done!
            </Modal.Title>
            
            <Form style={{padding: "30px"}}>
                
                
                <Form.Group className="mb-3" controlId="nft.description">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Collection Description"
                        className="mb-3"
                        rows={5}
                    >
                    <Form.Control 
                        type="input"
                        placeholder= 'Collection Description'
                        value={props.description}
                        onChange={e => props.setDescription(e.target.value)}/>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nft.Date">
                    <div style={{fontSize: 12}}>Concert Date</div>
                    <input
                        type="date"
                        name="from"
                        id="startdate"
                        value={props.date}
                        onChange={e => props.setDate(e.target.value)}
                        className="form-control datepicker"
                        style={{ width: "150px" }}
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.startTime" >
                            <div style={{fontSize: 12}}>Start Time</div>
                            <input
                                type="time"
                                name="from"
                                id="starttime"
                                value={props.startTime}
                                onChange={e => props.setStartTime(e.target.value)}
                                className="form-control timepicker"
                                style={{ width: "150px" }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="nft.startTime" >
                            <div style={{fontSize: 12}}>End Time</div>
                            <input
                                type="time"
                                name="from"
                                id="endtime"
                                value={props.endTime}
                                onChange={e => props.setEndTime(e.target.value)}
                                className="form-control timepicker"
                                style={{ width: "150px" }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        
                        <center>
                            Party Address
                        </center>

                    </Col>
                    <Col>
                        <center>
                            % Split
                        </center>
                    </Col>
                </Row>
                <hr/>
                <Row className="align-items-center">
                    <Col>
                        <Form.Group controlId="nft.editions">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Address"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Address'
                                value={props.recipientOneAddress}
                                onChange={e => props.setRecipientOneAddress(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="nft.editions">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Split %"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Split %'
                                value={props.recipientOneSplit}
                                onChange={e => props.setRecipientOneSplit(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row> 
                <Row className="align-items-center">
                    <Col>
                        <Form.Group controlId="nft.editions">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Address"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Address'
                                value={props.recipientTwoAddress}
                                onChange={e => props.setRecipientTwoAddress(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="nft.editions">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Split %"
                                className="mb-3"
                            >
                            <Form.Control 
                                type="input"
                                placeholder= 'Split %'
                                value={props.recipientTwoSplit}
                                onChange={e => props.setRecipientTwoSplit(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row> 
                <Row>
                <Col>
                    <Form.Group controlId="nft.editions">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Address"
                            className="mb-3"
                        >
                        <Form.Control 
                            type="input"
                            placeholder= 'Address'
                            value={props.recipientThree}
                            onChange={e => props.setRecipientThreeAddress(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="nft.editions">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Split %"
                            className="mb-3"
                        >
                        <Form.Control 
                            type="input"
                            placeholder= 'Split %'
                            value={props.recipientThreeSplit}
                            onChange={e => props.setRecipientThreeSplit(e.target.value)}/>
                        </FloatingLabel>
                    </Form.Group>
                </Col>
            </Row> 
    
                {props.mintErrMessage &&
                        <Alert variant='danger'>
                        <i class="bi bi-radioactive"></i>
                        {'  '}{props.mintErrMessage}    
                    </Alert>
                }
 
                <Button variant="dark" style={{borderRadius: "2rem", float: "left"}} onClick={()=>{props.handleShow();props.handleCloseTwo()}}>
                    Back
                </Button>
                
                <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>props.handleNextTwo()}>
                    Next
                </Button>

     
            </Form>       
        </Modal>
    )
}

export default ModalTwo