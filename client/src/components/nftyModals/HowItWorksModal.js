import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router'
import { ethers, utils } from 'ethers';
import Web3Modal from 'web3modal';

import xicon from '../../assets/images/xicon.png'

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



function HowItWorksModal(props) {
    
    return (
        <Modal show={props.showPDF} onHide={props.handleClosePDF} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
            <Modal.Header style={{backgroundColor: "black"}} >
                <Button style={{backgroundColor: "black"}} onClick={()=>props.handleClosePDF()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
            </Modal.Header>
            <img src={props.pdfHowItWorks}></img>
                <Row>
                    <Col>
                        <Button variant="dark" style={{borderRadius: "2rem", marginBottom:  "30px", marginRight: "30px", float: "right"}} onClick={()=>props.handleClosePDF()}>
                            Close
                        </Button>
                    </Col>
                </Row>
        </Modal>
    )
}

export default HowItWorksModal