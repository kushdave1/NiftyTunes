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



function NicknameModal(props) {
    
    return (
    <Modal show={props.showWelcomeModal} onHide={props.handleCloseWelcomeModal} contentClassName = 'modal-rounded-5' dialogClassName = 'modal-dialog-centered modal-dialog-scrollable'>
        <Modal.Header style={{backgroundColor: "black"}} >
            <Button style={{backgroundColor: "black", borderColor: "black"}} onClick={()=>props.handleCloseWelcomeModal()}><img style={{float: "right"}} height="20px" width="20px" src={xicon}></img></Button>
        </Modal.Header>
        <Modal.Title style={{padding: "30px 30px 0px 30px"}}>
            Welcome to NftyTunes! Please fill in a nickname to get started!
        </Modal.Title>
        <Form style={{padding: "30px"}}>
            <Form.Group className="mb-3" controlId="nft.nickname" >
                    <div style={{fontSize: 12}}>Enter a Nickname</div>
                    <input
                        type="nickname"
                        name="from"
                        id="nickname"
                        value={props.nickname}
                        onChange={e => props.setNickname(e.target.value)}
                    />
            </Form.Group>
            <Row>
                <Col>
                    <Button variant="dark" style={{borderRadius: "2rem", float: "right"}} onClick={()=>{props.handleCloseWelcomeModal();props.submitName();}}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    </Modal>
    )
}

export default NicknameModal